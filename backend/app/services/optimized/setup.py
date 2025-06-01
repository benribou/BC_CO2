from setuptools import setup
from Cython.Build import cythonize

setup(
    name="algorithms_c",
    ext_modules=cythonize("algorithms_c.pyx"),
)