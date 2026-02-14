def precision(recommended, relevant):

    tp = len(set(recommended) & set(relevant))

    if len(recommended) == 0:
        return 0

    return tp / len(recommended)


def recall(recommended, relevant):

    tp = len(set(recommended) & set(relevant))

    if len(relevant) == 0:
        return 0

    return tp / len(relevant)


def f1_score(p, r):

    if (p + r) == 0:
        return 0

    return 2 * p * r / (p + r)
