from typing import Type

MINUTES_TO_MICRO = 60000000

def simulate_temperature_cython(int duration_min,
                              float initial_temp,
                              float ambient_temp,
                              float wind_speed,
                              float intensity) -> Type[list]:
    """
    Simule l'évolution de la température du câble minute par minute.
    Affiche une barre de progression avec estimation du temps restant.

    :param duration_min: Durée de la simulation (minutes)
    :param initial_temp: Température initiale du câble (\u00b0C)
    :param ambient_temp: Température ambiante (\u00b0C)
    :param wind_speed: Vitesse du vent (m/s)
    :param intensity: Intensité électrique (A)
    :return: Liste des températures du câble à chaque minute (longueur duration_min + 1)
    """
    cdef list temperatures = [initial_temp]
    cdef float current_temp = initial_temp

    cdef float first = (-(wind_speed ** 2 / 1600 * 0.4) - 0.1)
    cdef float intensity_term = (intensity ** 1.4 / 73785) * 130

    cdef float second = 0
    cdef float delta = 0

    for _ in range(1, duration_min + 1):
        # for _ in range(MINUTES_TO_MICRO):
        second = (current_temp - ambient_temp - intensity_term)
        delta = first * second
        current_temp += delta
        temperatures.append(round(current_temp, 1))

    return temperatures
