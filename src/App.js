import React, { Component } from 'react';
import './App.css';
import img from './img/Upload-512.png';
import imageExtensions from 'image-extensions'

var all = imageExtensions;

function get_extension(name)
{
  let arr = name.split('.');
  return arr[arr.length-1];
}
function check(name)
{
  let s = get_extension(name);
  for(let i=0;i<all.length;i++)
  {
    if(s === all[i])
    return true;
  }
}
class App extends React.Component{
  constructor(props)
  {
    super(props);
    this.state = {
      data:[],
      fetch_data:undefined,
      file_list:"",
      wait:0
    }
    this.handle_file = this.handle_file.bind(this);
    this.send_file =  this.send_file.bind(this);
    this.render_image = this.render_image.bind(this);
    this.get_data = this.get_data.bind(this);
    this.countdown = this.countdown.bind(this);
    this.stop_spam = this.stop_spam.bind(this);
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
    console.log(all);
  }
  countdown()
  {
    if(this.state.wait <= 0)
    clearInterval(this.count);
    else
    {
    this.setState({wait:this.state.wait-1});
    }
  }
  stop_spam()
  {
    this.count = setInterval(this.countdown,1000);
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
    await this.setState({wait:30});
    this.stop_spam();
    await fetch("https://lkt-back-end.herokuapp.com/photo_gallery/all_data",{
      method:'POST',
      body: this.state.data
    })
    .catch((err) => {throw Error(err)} );

    alert("Sent data successfully. Please wait for 30 seconds");

    setTimeout(function(){
      this.get_data();
    }.bind(this),4000);

    this.setState({file_list:""});
  }

  async handle_file(e)
  {
    let files = e.target.files;
    let result = "";
    let formData = new FormData();
    
    for(let i=0;i<files.length;i++)
    {
      let file = files[i];
      let validate = await check(file.name);
      if(validate === true)
      {
      if(i !== files.length - 1)
      result = result + file.name + ",";
      else
      result = result + file.name
      formData.append('files',file);
      }
    }
    if(result[result.length-1] === ',')
    {
    let s = result.length;
    result = result.slice(0,s-1);
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
        <button onClick = {this.send_file} className = {(this.state.wait) ? "wait" : "upload"} disabled = {this.state.wait}>
        {(this.state.wait) ? this.state.wait : "UPLOAD"}
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
