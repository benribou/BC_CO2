# tc temp cable = result
from random import randint
import numpy as np
import time

MINUTES_TO_MICRO = 60000000

def algo_get_cable_temperature(temperature_cable: float, temperature_ambiant: float, wind_speed: float,
                               intensity: float) -> float:
    '''
    :param temperature_cable: from T0 in celsius
    :param temperature_ambiant: in celsius
    :param wind_speed: in meters per second
    :param intensity: in ampere
    :return: Temperature of the cable for T1 in celsius
    '''
    first = (-(wind_speed ** 2 / 1600 * 0.4) - 0.1)
    second = (temperature_cable - temperature_ambiant - (intensity ** 1.4 / 73785) * 130)
    delta_t = first * second
    return delta_t


def get_extrapolate_temperature(duration_minutes: int, cable_temperature: float, ambient_temperature: float,
                                wind_speed: float, intensity: float) -> list[float]:
    '''
    :param duration_minutes: duration in minute
    :param cable_temperature: from T0 temperature cable in celsius
    :param ambient_temperature: temperature ambient in celsius
    :param wind_speed: wind speed in meters per second
    :param intensity: intensity in ampere
    :return: list of temperatures in celsius (1 value per minute)
    '''
    times = list(range(duration_minutes))
    temperatures = [cable_temperature]
    print(f"Go To execute {duration_minutes} minutes = {duration_minutes * 60000000} micro second")

    for iter in times[1:]:
        current_temperature = temperatures[-1]
        start_time = time.time()
        print(f"Start : {start_time}")
        print(f"Compute for {iter} minute")
        micro_temp = []
        for _ in range(MINUTES_TO_MICRO):
            delta = algo_get_cable_temperature(current_temperature, ambient_temperature, wind_speed, intensity)
            micro_temp.append(current_temperature + delta)

        average = np.mean(micro_temp)
        temperatures.append(round(average, 1))
        end_time = time.time()
        estimated_time_second = (end_time - start_time) * (len(times) - iter)
        seconds = int(round(estimated_time_second % 60, 0))
        minutes = int(round(estimated_time_second // 60, 0))

        print(f"End, elapsed : {end_time - start_time}\nEstimated time : {minutes} mins, {seconds} seconds")

    return temperatures

if __name__ == '__main__':
    initial_temp = 25.0
    ambient_temp = 20.0
    wind_speed = 2.0
    intensity = 1000
    duration_minutes = 30

    print(get_extrapolate_temperature(duration_minutes, initial_temp, ambient_temp, wind_speed, intensity))