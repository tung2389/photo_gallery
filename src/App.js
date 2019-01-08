import React, { Component } from 'react';
import './App.css';
import img from './img/Upload-512.png';

class App extends React.Component{
  constructor(props)
  {
    super(props);
    this.state = {
      data:[],
      fetch_data:undefined,
      file_list:""
    }
    this.handle_file = this.handle_file.bind(this);
    this.send_file =  this.send_file.bind(this);
    this.render_image = this.render_image.bind(this);
    this.get_data = this.get_data.bind(this);
  }

  get_data()
  {
    fetch('https://lkt-back-end.herokuapp.com/photo_gallery/all_data')
    .then(res => res.json())
    .then(data => {this.setState({fetch_data:data})});
  }

  async componentDidMount()
  {
    await this.get_data();
  }

  render_image()
  {
    let data = this.state.fetch_data.map(obj => {
      return(
        <a href = {obj.filePath} key = {obj._id} target = "_blank" rel = "noopener noreferrer"><img alt = {obj.filePath} className  = "awesome_trick" key = {obj._id} src = {obj.filePath}></img></a>
      );
    });
    return data;
  }

  async send_file()
  {
    await fetch("https://lkt-back-end.herokuapp.com/photo_gallery/all_data",{
      method:'POST',
      body: this.state.data
    })
    .catch((err) => {throw Error(err)} );

    alert("Sent data successfully. Please wait for 4 seconds");

    setTimeout(function(){
      this.get_data();
    }.bind(this),4000);

    this.setState({file_list:""});
  }

  handle_file(e)
  {
    let files = e.target.files;
    let result = "";
    let formData = new FormData();

    for(let i=0;i<files.length;i++)
    {
      let file = files[i];
      if(i !== files.length - 1)
      result = result + file.name + ", ";
      else
      result = result + file.name
      formData.append('files',file);
    }
    this.setState({file_list:result});
    this.setState({data:formData});
  }

  render(){
    return(
      (this.state.fetch_data)
      ?
      (
      <div>
        <label className = "choose_file">
        FILE
        <input type = "file" multiple onChange = {this.handle_file} accept="image/*" className = "not_display" />
        </label>
        <span className = "file_list">{this.state.file_list}</span>
        <button onClick = {this.send_file} className = "upload">
        UPLOAD
        <img alt = "upload_image" src = {img}  className = "upload_image"></img>
        </button>
        <div className = "images">
          {this.render_image()}
        </div>
      </div>
      )
      :
      (
        <div align = "center">Loading...</div>
      )
    );
  }
}

export default App;