from codecarbon import EmissionsTracker

def function_to_track():
    tracker = EmissionsTracker(output_dir="app/data/", output_file="emissions.csv")
    tracker.start()
    
    # Simule du calcul
    for _ in range(1000000):
        pass

    tracker.stop()