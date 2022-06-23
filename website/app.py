from flask import Flask, render_template, request
import jyserver.Flask as jsf
import os
import pandas as pd
import pyrebase
from datetime import datetime

app = Flask(__name__)

class App:
    def __inti__(self):
        self.count = 0


@app.route("/", methods=['GET', 'POST'])
def index():
    if request.method == 'get':
        username = request.form['email']
        print(username)
        # return render_template('index.html', uploadData = ["True", ConcCd, ConcPb, ConcCu, ConcHg])
    if request.method == 'POST':
        file = request.files['csvfile']
        if not os.path.isdir('static'):
            os.mkdir('static')
            # if not os.path.isdir('data'):
            #     os.mkdir('data')
        filepath = os.path.join('static', file.filename)
        file.save(filepath)
        data = pd.read_excel(file)
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
        print(f'Peak Current for Cadmium is {CdY}uA at Potential {CdX}V')
        print(f'Peak Current for Lead is    {PbY}uA at Potential {PbX}V')
        print(f'Peak Current for Copper is  {CuY}uA at Potential {CuX}V')
        print(f'Peak Current for Mercury is {HgY}uA at Potential {HgX}V')
        ConcCd = 313.72*CdY + 64.43
        ConcPb = 147.25*PbY + 59.37
        ConcCu = 151.99*CuY + 57.67
        ConcHg = 276.58*HgY+ 89.613
        print(f'Concentration of Cadmium is {ConcCd} \nConcentration of Lead is {ConcPb} \nConcentration of Copper is {ConcCu} \nConcentration of Mercury is {ConcHg}\n')
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
        # userName="shubham22"#name_var.get()
        # userName = request.username['csvfile']
        result = request.form
        userName = result['username']
        # trialNo=trialno_var.get()
        # userName = "shubham"
        # trialNo = 7
        # locale.setlocale(
        # category=locale.LC_ALL,
        # locale="German"  # Note: do not use "de_DE" as it doesn't work
        # )
        dateTime = datetime.now().strftime("%d-%m-%Y, %H:%M:%S")
        # dateTime = dateTime.strftime("%d-%m-%Y, ")+ dateTime.strftime("%H").replace('0','')+dateTime.strftime(":%M:%S") # %H for 24 hr format 
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

        #messagebox.showinfo("Uploaded","Uploaded to Firebase")
        print("Uploaded to Firebase")

        return render_template('index.html', uploadData = ["True", ConcCd, ConcPb, ConcCu, ConcHg])

    return render_template('index.html', uploadData = ["False",0,0,0,0] )

if __name__ == "__main__":
    app.run(debug=True); 