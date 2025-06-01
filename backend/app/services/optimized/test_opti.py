import time

from codecarbon import EmissionsTracker
import time

from algorithms_c import simulate_temperature_cython

if __name__ == "__main__":

    initial_temp = 25.0
    ambient_temp = 20.0
    wind_speed = 2.0
    intensity = 1000
    duration_minutes = 30

    times = list(range(duration_minutes+ 1))
    temperatures = [initial_temp]

    tracker = EmissionsTracker()
    tracker.start()
    start_time = time.time()

    temperatures.extend(simulate_temperature_cython(duration_minutes, initial_temp, ambient_temp, wind_speed, intensity))

    exec_time = time.time() - start_time
    tracker.stop()

    result = {
        'cpu_usage_kWh': tracker.final_emissions_data.cpu_energy,
        'gpu_usage_kWh': tracker.final_emissions_data.gpu_energy,
        'ram_energy_kWh': tracker.final_emissions_data.ram_energy,
        'energy_consumed': tracker.final_emissions_data.energy_consumed,
        'exec_time_in_seconds': exec_time,
        'result': temperatures
    }
    print(result)