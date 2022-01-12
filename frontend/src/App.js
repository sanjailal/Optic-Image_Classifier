import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Button from "@mui/material/Button";
import CameraIcon from "@mui/icons-material/PhotoCamera";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Link from "@mui/material/Link";
import CardMedia from "@mui/material/CardMedia";
import { createTheme, ThemeProvider } from "@mui/material/styles";


class Main extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      imageURL: "",
      name: "",
      score: "",
      file: [],
    };
    this.state = {showImage: false};
    this.state = {showResult: false};
    this.handleUploadImage = this.handleUploadImage.bind(this);
    this.previewImage = this.previewImage.bind(this);
  }

  previewImage(ev){
    ev.preventDefault();
    this.setState({showImage:true});
    var file = this.uploadInput.files[0];
    var reader = new FileReader();
    var url = reader.readAsDataURL(file);
    console.log([reader.result]);
    reader.onloadend = function (e) {
      this.setState({ imgSrc: reader.result });
    }.bind(this);
    console.log(url);
  }

  handleUploadImage(ev) {
    ev.preventDefault();

    const data = new FormData();
    console.log(this.uploadInput.files[0]);
    data.append("file", this.uploadInput.files[0]);
    console.log(data.get("file"));
    fetch("http://127.0.0.1:5000/upload", {
      // fetch('https://optic-image-classifier.herokuapp.com/upload', {
      method: "POST",
      body: data,
    }).then((response) => {
      this.setState({showResult:true});
      response.json().then((body) => {
        this.setState({ name: `${body.name}` });
        this.setState({ score: `${body.score}` });
      });
    });
  }
  Copyright() {
    return (
      <Typography variant="body2" color="text.secondary" align="center">
        {"Copyright © "}
        <Link color="inherit" href="https://mui.com/">
          Your Website
        </Link>{" "}
        {new Date().getFullYear()}
        {"."}
      </Typography>
    );
  }

  cards = [1, 2, 3, 4, 5, 6, 7, 8, 9];

  render() {
    const showImage = this.state.showImage;
    let showImageTag;
    console.log(showImage);
    if (showImage) {
      showImageTag = <CardMedia             
        component="img"
        sx={{
          width: "40%",
          alignItems: "center",
        }}
        image={this.state.imgSrc}
        alt="random"
      />;
      } 
    const showResult = this.state.showResult;
    let showResultTag;
    if (showResult) {
      showResultTag = <Box sx={{ bgcolor: "background.paper", p: 6 }} component="footer">
      <Typography variant="h6" align="center" gutterBottom>
        Voila!
      </Typography>
      <Typography
        variant="subtitle1"
        align="center"
        color="text.secondary"
        component="p"
      >
        I am {this.state.score} sure. This is {this.state.name}.
      </Typography>
    </Box>;
      } 
    return (
      <ThemeProvider theme={createTheme()}>
        <CssBaseline />
        <AppBar position="relative">
          <Toolbar>
            <CameraIcon sx={{ mr: 2 }} />
            <Typography variant="h6" align="center" color="inherit" noWrap>
              Optic
            </Typography>
          </Toolbar>
        </AppBar>
        <main>
          <Box
            sx={{
              bgcolor: "background.paper",
              pt: 8,
              pb: 6,
            }}
          >
            <Container maxWidth="sm">
              <Box
                sx={{
                  marginTop: 1,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  marginLeft:12,
                }}
              >
                
                <form onSubmit={this.handleUploadImage}>
                <label class="custom-file-upload">
                  <input
                  size="60"
                    accept="image/*" 
                    ref={(ref) => { this.uploadInput = ref; }}
                    type="file"
                    name="user[image]"
                    onChange={this.previewImage}
                  />
                  </label>
                  <Box
                  sx={{
                  alignItems: "center",
                  marginTop: 4,
                  }}></Box>
                  <Button sx={{marginLeft:5}}type="submit" variant="outlined">Predict</Button>
                </form>
              </Box>
              <Box
              
                sx={{
                  marginTop: 8,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                {showImageTag}
              </Box>
            </Container>
          </Box>
        </main>
        {showResultTag}
      </ThemeProvider>
    );
  }
}

export default Main;