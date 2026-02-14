"""
NOVEL CONTRIBUTION: Hybrid Multi-Armed Bandit Ensemble
Combines LinUCB, Thompson Sampling, and Neural UCB

This is the MAIN NOVELTY of the project!
"""

import numpy as np
from typing import Dict, List, Tuple

from bandit.linucb import LinUCB
from bandit.thompson_sampling import ThompsonSamplingBandit
from bandit.neural_ucb import NeuralUCB


class HybridMultiArmedBandit:
    """
    Ensemble of multiple bandit algorithms
    """

    def __init__(
        self,
        arms: List[str],
        n_features: int,
        initial_weights: Dict[str, float] = None,
    ):

        self.arms = arms
        self.n_features = n_features

        # -----------------------------
        # Initialize base bandits
        # -----------------------------
        self.linucb = LinUCB(arms, n_features, alpha=1.0)
        self.thompson = ThompsonSamplingBandit(arms)
        self.neural = NeuralUCB(arms, n_features, hidden_size=64)

        # -----------------------------
        # Ensemble Weights
        # -----------------------------
        if initial_weights is None:
            self.weights = {
                "linucb": 0.4,
                "thompson": 0.3,
                "neural": 0.3,
            }
        else:
            self.weights = initial_weights

        # -----------------------------
        # Performance Tracking
        # -----------------------------
        self.performance = {
            "linucb": [],
            "thompson": [],
            "neural": [],
        }

        self.meta_learning_rate = 0.1
        self.weight_history = []

    # ==========================================================
    # RECOMMENDATION
    # ==========================================================

    def recommend(
        self, contexts: Dict[str, np.ndarray], method="weighted_voting"
    ) -> Tuple[str, Dict]:

        if method == "best_performer":
            return self._best_performer(contexts)

        if method == "context_dependent":
            return self._context_dependent(contexts)

        return self._weighted_voting(contexts)

    # ==========================================================
    # WEIGHTED VOTING (MAIN METHOD)
    # ==========================================================

    def _weighted_voting(self, contexts):

        skill_scores = {}
        individual_predictions = {}

        for skill, context in contexts.items():

            context = self._ensure_column_vector(context)

            # -----------------------------
            # LINUCB SCORE
            # -----------------------------
            A = self.linucb.A[skill]
            b = self.linucb.b[skill]

            # Regularized inverse for stability
            A_inv = np.linalg.inv(A + np.eye(A.shape[0]) * 1e-6)
            theta = A_inv @ b

            linucb_score = float(
                theta.T @ context
                + self.linucb.alpha
                * np.sqrt(context.T @ A_inv @ context)
            )

            # -----------------------------
            # THOMPSON SCORE
            # -----------------------------
            alpha = self.thompson.alpha.get(skill, 1)
            beta = self.thompson.beta.get(skill, 1)

            thompson_score = np.random.beta(alpha, beta)

            # -----------------------------
            # NEURAL UCB SCORE
            # -----------------------------
            neural_pred = self.neural.get_prediction(context, skill)

            updates = max(self.neural.updates.get(skill, 1), 1)
            exploration_bonus = 1.0 / np.sqrt(updates)

            neural_score = float(neural_pred + exploration_bonus)

            # -----------------------------
            # STORE INDIVIDUAL
            # -----------------------------
            individual_predictions[skill] = {
                "linucb": linucb_score,
                "thompson": thompson_score,
                "neural": neural_score,
            }

            # -----------------------------
            # ENSEMBLE SCORE
            # -----------------------------
            skill_scores[skill] = (
                self.weights["linucb"] * linucb_score
                + self.weights["thompson"] * thompson_score
                + self.weights["neural"] * neural_score
            )

        # Best skill
        best_skill = max(skill_scores, key=skill_scores.get)

        explanation = {
            "recommended_skill": best_skill,
            "ensemble_score": skill_scores[best_skill],
            "individual_scores": individual_predictions[best_skill],
            "weights": self.weights.copy(),
            "method": "weighted_voting",
        }

        return best_skill, explanation

    # ==========================================================
    # BEST PERFORMER
    # ==========================================================

    def _best_performer(self, contexts):

        recent_window = 50
        perf = {}

        for algo in self.performance:

            history = self.performance[algo]

            if len(history) == 0:
                perf[algo] = 0.5
            else:
                perf[algo] = np.mean(history[-recent_window:])

        best_algo = max(perf, key=perf.get)

        if best_algo == "linucb":
            skill = self.linucb.recommend(contexts)

        elif best_algo == "thompson":
            skill = self.thompson.recommend(list(contexts.keys()))

        else:
            skill = self.neural.recommend(contexts)

        explanation = {
            "recommended_skill": skill,
            "selected_algorithm": best_algo,
            "recent_performance": perf,
            "method": "best_performer",
        }

        return skill, explanation

    # ==========================================================
    # CONTEXT DEPENDENT
    # ==========================================================

    def _context_dependent(self, contexts):

        sample_context = self._ensure_column_vector(
            list(contexts.values())[0]
        )

        variance = float(np.var(sample_context))

        if variance > 0.5:
            algo = "thompson"
            skill = self.thompson.recommend(list(contexts.keys()))

        elif len(self.neural.history.get(list(contexts.keys())[0], [])) > 100:
            algo = "neural"
            skill = self.neural.recommend(contexts)

        else:
            algo = "linucb"
            skill = self.linucb.recommend(contexts)

        explanation = {
            "recommended_skill": skill,
            "selected_algorithm": algo,
            "context_variance": variance,
            "method": "context_dependent",
        }

        return skill, explanation

    # ==========================================================
    # UPDATE
    # ==========================================================

    def update(self, skill, reward, context):

        context = self._ensure_column_vector(context)

        self.linucb.update(skill, reward, context)
        self.thompson.update(skill, reward)
        self.neural.update(skill, reward, context, n_epochs=5)

        self.performance["linucb"].append(reward)
        self.performance["thompson"].append(reward)
        self.performance["neural"].append(reward)

        if len(self.performance["linucb"]) % 20 == 0:
            self._meta_learn()

    # ==========================================================
    # META LEARNING
    # ==========================================================

    def _meta_learn(self):

        window = 100
        recent_perf = {}

        for algo in self.performance:

            history = self.performance[algo]

            if len(history) >= window:
                recent_perf[algo] = np.mean(history[-window:])
            else:
                recent_perf[algo] = self.weights[algo]

        # Softmax weighting
        exp_vals = {
            k: np.exp(v * 5) for k, v in recent_perf.items()
        }

        total = sum(exp_vals.values())

        new_weights = {
            k: exp_vals[k] / total for k in exp_vals
        }

        # Smooth update
        for algo in self.weights:
            self.weights[algo] = (
                (1 - self.meta_learning_rate)
                * self.weights[algo]
                + self.meta_learning_rate
                * new_weights[algo]
            )

        # Normalize
        total = sum(self.weights.values())
        for algo in self.weights:
            self.weights[algo] /= total

        self.weight_history.append(self.weights.copy())

    # ==========================================================
    # PERFORMANCE SUMMARY
    # ==========================================================

    def get_performance_summary(self):

        summary = {}

        for algo in self.performance:

            history = self.performance[algo]

            if len(history) == 0:
                mean = std = 0
            else:
                mean = np.mean(history)
                std = np.std(history)

            summary[algo] = {
                "mean_reward": mean,
                "std_reward": std,
                "total_updates": len(history),
                "current_weight": self.weights[algo],
            }

        return summary

    # ==========================================================
    # UTILITY
    # ==========================================================

    def _ensure_column_vector(self, x):

        x = np.array(x)

        if x.ndim == 1:
            x = x.reshape(-1, 1)

        return x
