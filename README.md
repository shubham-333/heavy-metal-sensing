# Heavy metal Sensing

## Clone the repositry
`git clone https://github.com/shubham-333/heavy-metal-sensing.git`

## Virtual environment setup
```
pip install virtualenv
virtualenv venv
venv\scripts\activate
```

## For website

### Install requirements in venv
```
cd website
pip install -r requirements.txt
```
### Run Locally
```
python app.py
```  

## For Application

### To compile the Heavy_metal_Detection.py to an exe file
```
cd app
pip install -r requirements.txt
pip install pyinstaller
pyinstaller.exe --onefile --hidden-import tkinter --icon=icon.ico --windowed Heavy_Metal_Detection.py
```
