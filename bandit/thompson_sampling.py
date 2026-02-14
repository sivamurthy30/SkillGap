"""
Thompson Sampling Bandit - Bayesian Approach
Novel contribution: Hybrid ensemble with LinUCB
"""

import numpy as np
from typing import Dict, List

class ThompsonSamplingBandit:
    """
    Thompson Sampling using Beta distributions
    Bayesian approach to exploration-exploitation
    """
    
    def __init__(self, arms: List[str]):
        """
        Initialize Thompson Sampling with Beta priors
        
        Args:
            arms: List of skill names
        """
        self.arms = arms
        
        # Beta distribution parameters (alpha, beta)
        # Start with uniform prior: Beta(1, 1)
        self.alpha = {arm: 1.0 for arm in arms}
        self.beta = {arm: 1.0 for arm in arms}
        
        # Track statistics
        self.pulls = {arm: 0 for arm in arms}
        self.rewards_history = {arm: [] for arm in arms}
    
    def recommend(self, candidate_skills: List[str]) -> str:
        """
        Sample from Beta distributions and pick highest
        
        This naturally balances exploration and exploitation:
        - High uncertainty → wide distribution → more exploration
        - High reward → alpha increases → exploitation
        """
        samples = {}
        
        for skill in candidate_skills:
            # Sample from Beta(alpha, beta)
            samples[skill] = np.random.beta(
                self.alpha[skill],
                self.beta[skill]
            )
        
        # Pick skill with highest sample
        recommended = max(samples, key=samples.get)
        self.pulls[recommended] += 1
        
        return recommended
    
    def update(self, skill: str, reward: float):
        """
        Update Beta distribution parameters
        
        For binary rewards (0 or 1):
        - Success → alpha += 1
        - Failure → beta += 1
        
        For continuous rewards [0, 1]:
        - alpha += reward
        - beta += (1 - reward)
        """
        self.alpha[skill] += reward
        self.beta[skill] += (1 - reward)
        
        self.rewards_history[skill].append(reward)
    
    def get_statistics(self, skill: str) -> Dict:
        """Get statistics for a skill"""
        if self.pulls[skill] == 0:
            return {
                'mean': 0.5,
                'variance': 0.083,  # Var of Beta(1,1)
                'pulls': 0
            }
        
        # Mean of Beta(α, β) = α / (α + β)
        mean = self.alpha[skill] / (self.alpha[skill] + self.beta[skill])
        
        # Variance = αβ / ((α+β)²(α+β+1))
        a, b = self.alpha[skill], self.beta[skill]
        variance = (a * b) / ((a + b) ** 2 * (a + b + 1))
        
        return {
            'mean': mean,
            'variance': variance,
            'pulls': self.pulls[skill],
            'alpha': self.alpha[skill],
            'beta': self.beta[skill]
        }
    
    def get_confidence_interval(self, skill: str, confidence: float = 0.95) -> tuple:
        """
        Calculate confidence interval for expected reward
        
        Uses percentiles of Beta distribution
        """
        lower = (1 - confidence) / 2
        upper = 1 - lower
        
        lower_bound = np.random.beta(
            self.alpha[skill], 
            self.beta[skill], 
            10000
        )
        
        return (
            np.percentile(lower_bound, lower * 100),
            np.percentile(lower_bound, upper * 100)
        )


# Test
if __name__ == "__main__":
    arms = ['Python', 'JavaScript', 'Java']
    ts = ThompsonSamplingBandit(arms)
    
    # Simulate recommendations
    for _ in range(100):
        skill = ts.recommend(arms)
        
        # Simulate reward (Python is better)
        if skill == 'Python':
            reward = np.random.beta(8, 2)  # High success
        else:
            reward = np.random.beta(3, 7)  # Lower success
        
        ts.update(skill, reward)
    
    # Print results
    for skill in arms:
        stats = ts.get_statistics(skill)
        print(f"{skill}: Mean={stats['mean']:.3f}, Pulls={stats['pulls']}")
