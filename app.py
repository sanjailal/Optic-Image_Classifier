from torchvision import models
import torch,os
from PIL import Image
from torchvision import transforms
from flask import Flask, json,request, render_template,jsonify

resnet = models.resnet18(pretrained=True)
app = Flask(__name__)

transform = transforms.Compose([transforms.Resize(256),
                transforms.CenterCrop(224),
                transforms.ToTensor(),
                transforms.Normalize(mean=[0.485, 0.456, 0.406],std=[0.229, 0.224, 0.225] )])

def processing(filename):
    img = Image.open(filename)

    img_t = transform(img)
    batch_t = torch.unsqueeze(img_t, 0)

    resnet.eval()

    out = resnet(batch_t)
    print(out.shape)

    with open('imagenet.txt') as f:
        classes = [line.strip() for line in f.readlines()]

    _, index = torch.max(out, 1)
    percentage = torch.nn.functional.softmax(out, dim=1)[0] * 100
    print(classes[index[0]], percentage[index[0]].item())

    _, indices = torch.sort(out, descending=True)
    [(classes[idx], percentage[idx].item()) for idx in indices[0][:5]]
    return classes[index[0]], percentage[index[0]].item()
predname,predscore="as","cs"

@app.route('/upload', methods=['GET','POST'])
def upload_file():
    print('in the upload_file!')
    
    if request.method == 'POST':
        f = request.files['file']  
        f.save(f.filename)
        print(f.filename)
        print(f.filename)
        predname,predscore=processing(f.filename)
        predname=predname.split(',')[1]
        predscore=str(predscore)[:5]
        if os.path.exists(f.filename):
            os.remove(f.filename)
        else:
            print("The file does not exist")
        print(predname,predscore)
        response_body = {
            "name": predname,
            "score" :predscore
        }
        response_body=jsonify(response_body)
        response_body.headers.add('Access-Control-Allow-Origin', '*')
        return response_body
@app.route('/')
def index():
    return "Flask running"


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')

