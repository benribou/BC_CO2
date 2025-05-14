# tc temp cable = result
from random import randint


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

    for _ in times[1:]:
        current_temperature = temperatures[-1]
        delta = algo_get_cable_temperature(current_temperature, ambient_temperature, wind_speed, intensity)
        temperatures.append(round(current_temperature + delta, 1))

    return temperatures

