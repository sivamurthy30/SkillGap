import matplotlib.pyplot as plt

def plot_rewards(rewards):

    plt.figure()

    plt.plot(rewards)

    plt.title("Cumulative Reward Over Time")
    plt.xlabel("Iterations")
    plt.ylabel("Reward")

    plt.show()


def plot_accuracy(acc_list):

    plt.figure()

    plt.plot(acc_list)

    plt.title("Recommendation Accuracy")
    plt.xlabel("Iterations")
    plt.ylabel("Accuracy")

    plt.show()
