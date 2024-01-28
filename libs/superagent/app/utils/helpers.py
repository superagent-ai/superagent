def get_first_non_null(*args):
    """
    Returns the first non-null argument
    """
    for arg in args:
        if arg is not None:
            return arg
    return None  # Return None


def remove_key_if_present(dictionary, key):
    """
    Removes a key from a dictionary if it exists
    """
    if key in dictionary:
        del dictionary[key]


def compare_dicts(dict1, dict2):
    """
    Returns a dictionary of the changed fields between two dictionaries

    dict1: The first dictionary to compare
    dict2: The second dictionary to compare
    """
    changed_fields = {}

    # Check for changed values in common keys
    for key in set(dict1.keys()).intersection(dict2.keys()):
        if dict1[key] != dict2[key]:
            changed_fields[key] = dict2[key]

    # Check for keys that are only in dict1
    for key in set(dict1.keys()) - set(dict2.keys()):
        changed_fields[key] = None

    # Check for keys that are only in dict2
    for key in set(dict2.keys()) - set(dict1.keys()):
        changed_fields[key] = dict2[key]

    return changed_fields


def rename_and_remove_key(dictionary, old_key, new_key):
    """
    Renames a key in a dictionary and removes the old key if it exists

    dictionary: The dictionary to rename the key in
    old_key: The old key to rename
    new_key: The new key to rename to
    """
    if old_key in dictionary:
        dictionary[new_key] = dictionary[old_key]
        del dictionary[old_key]
