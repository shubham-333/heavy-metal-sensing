# To compile in .exe use
#pyinstaller.exe --onefile --hidden-import tkinter --icon=icon.ico --windowed Heavy_Metal_Detection.py
from tkinter import *
from tkinter import messagebox
from tkinter import filedialog as fd
from tkinter.filedialog import askopenfilename
from tkinter import ttk
import tkinter.filedialog as fd
from tkinter.messagebox import showinfo
import csv
import pyrebase
import pandas as pd
import numpy as np
import firebase_admin
from firebase_admin import credentials
# from firebase_admin import firestore
from firebase_admin import db
from datetime import datetime
import math
import locale


# from openpyxl import workbook
# from openpyxl import load_workbook


# def fix_nulls(s):
#     for line in s:
#         yield line.replace('\0', ' ')
main_window = Tk()
main_window.title("Heavyy Metal Detection")
main_window.geometry("600x300")
main_window.configure(background="#FFFFFF") # cyan: "#00ffff"
#main_window.iconbitmap('icon.ico')
data = pd.DataFrame()
#data = pd.read_excel("data.xlsx")
def select_file():
    filetypes = (('Excel Workbook', '*.xlsx*'),('CSV', '*.csv'),('All Files', '*.*'))
    filename = fd.askopenfilename(title='Open a file',initialdir='/D:/3-2/Project/_new-project/App',filetypes=filetypes)
    showinfo(title='Selected File',message=filename)
    global data
    data = pd.read_excel(filename)
    return data
# open button
open_button = ttk.Button(main_window,text='Select a File',command=select_file).grid(row=2)

name_var=StringVar()
trialno_var=StringVar()

name_label = Label(main_window, text = 'Username', font=('calibre',10, 'bold')).grid(row=0,column=0)
name_entry = Entry(main_window,textvariable = name_var, font=('calibre',10,'normal')).grid(row=0,column=1)

trialno_label = Label(main_window, text = 'TrialNo', font = ('calibre',10,'bold')).grid(row=1,column=0)
trialno_entry= Entry(main_window, textvariable = trialno_var, font = ('calibre',10,'normal')).grid(row=1,column=1)#, show = '*').grid(row=1,column=1)



def calc():
    global data
    CdY = 0.0
    PbY = 0.0
    CuY = 0.0
    HgY = 0.0
    for d in range(0,len(data)):
        if(data.iat[d,1]>-0.80 and data.iat[d,0]<-0.70 and CdY<data.iat[d,1]): #range(-0.8,-0.1)
            CdY = data.iat[d,1]
            CdX = data.iat[d,0]
        if(data.iat[d,1]>-0.45 and data.iat[d,0]<-0.35 and PbY<data.iat[d,1]): #range(-0.45,0.35)
            PbY = data.iat[d,1]
            PbX = data.iat[d,0]
        if(data.iat[d,1]>-0.05 and data.iat[d,0]<0.1 and CuY<data.iat[d,1]): #range(-0.05,0.1)
            CuY = data.iat[d,1]
            CuX = data.iat[d,0]
        if(data.iat[d,1]>-0.35 and data.iat[d,0]<0.45 and HgY<data.iat[d,1]):#range(-0.35,0.45)
            HgY = data.iat[d,1]
            HgX = data.iat[d,0]
    # print(f'Peak Current for Cadmium is {CdY}uA at Potential {CdX}V')
    # print(f'Peak Current for Lead is    {PbY}uA at Potential {PbX}V')
    # print(f'Peak Current for Copper is  {CuY}uA at Potential {CuX}V')
    # print(f'Peak Current for Mercury is {HgY}uA at Potential {HgX}V')
    # emptylable = Label(main_window,text=".").grid(x=0,y=0)
    emptylable = Label(main_window, text="Peak Current for Cadmium is: " + str(CdY) + "μA at Potential " + str(CdX)).grid(row=2, column=1)
    emptylable = Label(main_window, text="Peak Current for Lead is   : " + str(PbY) + "μA at Potential " + str(PbX)).grid(row=3, column=1)
    emptylable = Label(main_window, text="Peak Current for Copper is : " + str(CuY) + "μA at Potential " + str(CuX)).grid(row=4, column=1)
    emptylable = Label(main_window, text="Peak Current for Mercury is: " + str(HgY) + "μA at Potential " + str(HgX)).grid(row=5, column=1)
    
    ConcCd = 313.72*CdY + 64.43
    ConcPb = 147.25*PbY + 59.37
    ConcCu = 151.99*CuY + 57.67
    ConcHg = 276.58*HgY+ 89.613
    # print(f'Concentration of Cadmium is {ConcCd} \nConcentration of Lead is {ConcPb} \nConcentration of Copper is {ConcCu} \nConcentration of Mercury is {ConcHg}\n')
    emptylable = Label(main_window, text="Concentration of Cadmium is: " + str(ConcCd)).grid(row=6, column=1)
    emptylable = Label(main_window, text="Concentration of Lead is   : " + str(ConcPb)).grid(row=7, column=1)
    emptylable = Label(main_window, text="Concentration of Copper is : " + str(ConcCu)).grid(row=8, column=1)
    emptylable = Label(main_window, text="Concentration of Mercury is: " + str(ConcHg)).grid(row=9, column=1)

    upload_to_firebase(ConcCd,ConcPb,ConcCu,ConcHg)

def upload_to_firebase(ConcCd,ConcPb,ConcCu,ConcHg):
    print("Uploading to Firebase")
    firebaseConfig = {
        'apiKey': "AIzaSyAiLTBylHxOyt_UKk7idl93INTq7akZvJA",
        'authDomain': "heavy-metal-detection-f41f6.firebaseapp.com",
        'databaseURL': "https://heavy-metal-detection-f41f6-default-rtdb.firebaseio.com",
        'projectId': "heavy-metal-detection-f41f6",
        'storageBucket': "heavy-metal-detection-f41f6.appspot.com",
        'messagingSenderId': "414213176253",
        'appId': '1:414213176253:web:d3e2db3e60f529de11b0d4',
    };
    userName=name_var.get()
    dateTime = datetime.now().strftime("%d-%m-%Y, %H:%M:%S")
    
    firebase = pyrebase.initialize_app(firebaseConfig)
    db = firebase.database()
    data = {
    "CadmiumConc": "{:.2f}".format(ConcCd),
    "CopperConc": "{:.2f}".format(ConcCu),
    "LeadConc": "{:.2f}".format(ConcPb),
    "MercuryConc": "{:.2f}".format(ConcHg),
    "dateTime": str(dateTime),
    }
    db.child("users").child(userName).child(dateTime).set(data)

    messagebox.showinfo("Uploaded","Uploaded to Firebase")
    print("Uploaded to Firebase")





b1 = Button(main_window, text = "Get Results", command = calc).grid(row=3)
main_window.mainloop()