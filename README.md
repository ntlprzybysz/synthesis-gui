# Project Description
This project focuses on developing a graphical interface in Django for tools for synthesizing speech developed by [@stefantaubert](https://github.com/stefantaubert).
![Screenshot of the interface from 21.06.2023](Screenshot_2023-06-21.png)

# Contributions, Citations, License
If you're intrested in contributing to the project, want to cite it or find out more about it, please contact its owner, [@stefantaubert](https://github.com/stefantaubert).

# Viewing and Running Project Locally

## Prerequisites

Please make sure that you have installed globally:
- Python 3.10 for working with Python scripts,
- pip for installing packages,
- pyenv for creating a virtual environment.

## Installation

1. Create a local copy of the repository on your machine. 

Move to the directory where you want to hold the project. Then, to create a local copy of the repository, type in your Terminal window:
```
git clone git@github.com:ntlprzybysz/synthesis-gui.git
```

2. Move to the directory of the project:
```
cd synthesis-gui
```

3. Create a virtual environment within the directory:
```
pipenv --python3.10
```
If pipenv installs the virtual environment with a Python version different than the specified version 3.10, please go to step 3a. Otherwise, please go to step 3b.

3a. If pipenv installs the virtual environment with a Python version different than the specified version 3.10, please remove the newly created environment:
```
pipenv --rm
```
Close the terminal window, open a new terminal window and navigate back to the project directory with `cd synthesis-gui`. Then, find your path to python3.10:
```
which python3.10
```
Install the virtual environment with the given path:
```
pipenv shell --python /your/path/python3.10
```

3b. If there's no `(synthesis-gui)` in front of your username in your terminal window, the virtual environment you just created isn't active. Please activate it:
```
pipenv shell
```

4. Install dependencies of the project within your virtual environment:
```
pip3 install -r requirements.txt
```

5. Run a local server to see the website:
```
python manage.py runserver
```

6. Open the website in your browser by visiting http://localhost:8000/synthesis/.

7. If you're done, close the server by pressing `CTRL` + `C`.

8. Deactivate the virtual environment:
```
deactivate
```
