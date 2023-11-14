def run_async_code_in_thread(func, *args, **kwargs):
    import threading
    from queue import Queue
    result_queue = Queue()

    def run_in_thread():
        try:
            result = func(*args, **kwargs)
        except Exception as e:
            result_queue.put(e)
        else:
            result_queue.put(result)

    thread = threading.Thread(target=run_in_thread)
    thread.start()
    thread.join()

    result = result_queue.get()
    if isinstance(result, Exception):
        raise result
    return result
