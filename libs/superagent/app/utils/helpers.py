# returns first non null key
def get_first_non_null(*args):
    for arg in args:
        if arg is not None:
            return arg
    return None  # Return None
