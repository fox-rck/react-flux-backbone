'use strict';
var React = require('react');
var AppConstants = require('project/app/constants');
var dispatch = require('project/shared/helpers/dispatch');
var appConstants = require('project/constants');
var ColorCircle = require('project/group/ColorCircle');
var ImagePicker = require('project/group/ImagePicker');
var GroupActions = require('project/group/GroupActions');

module.exports = React.createClass({
    getInitialState: function() {
        return {
            colorSelectOpen: false
            , color: null
            , getColorSet: false
            , image: null
            , getImageSet: false
            , imgSelectOpen: false
            , title: ""
        }
    },
    saveState: function() {
        GroupActions.update({
            _id: this.props.group._id
            ,title: this.state.title
            , color: this.state.color
            , photo: this.state.image
        });
        this.closeDetails();
    },
    componentDidMount: function(){
        console.log(this.props.group)
        this.setState({
            color: this.props.group.color
            , image: this.props.group.photo
            , title: this.props.group.title
        })
    },
    selectColor: function(color){
        this.setState({colorSelectOpen:!this.state.colorSelectOpen,color: color});
    },
    selectImg: function(img){
        this.setState({imgSelectOpen:false,image: img});
    },
    closeDetails: function(){
        this.props.close();
    },
    toggleColorSelect: function() {
        this.setState({colorSelectOpen:!this.state.colorSelectOpen, imgSelectOpen: false, getColorSet: false});
    },
    toggleImgSelect: function() {
        this.setState({imgSelectOpen:!this.state.imgSelectOpen, colorSelectOpen: false, getColorSet: false});
    },
    getColors: function(showAll) {
        var initSet = appConstants.colorBasics;
        var fullSet = appConstants.colorAdvanced;
        var ret = initSet;
        if(showAll){
            ret = fullSet;
        }
        return ret;
    },
    getImages: function(showAll) {
        var initSet = appConstants.stickerBasics;
        var fullSet = appConstants.stickerAdvanced;
        var ret = initSet;
        if(showAll){
            ret = fullSet;
        }
        return ret;
    },
    changeColorSet: function() {
        this.setState({getColorSet:!this.state.getColorSet});
    },
    handleChange: function(event) {
        this.setState({title: event.target.value});
    },
    render: function() {
        var colorSet = this.state.getColorSet;
        var selectionPopOver = this.state.colorSelectOpen?<div className="selection-popover">
        <div className="container">
            <button className="push" onClick={this.toggleColorSelect}>Cancel</button>
            <div className="clear"/>
            Select a color:
            <div className="row no-gutter">
            {this.getColors(colorSet).map((color)=>
                <div className="col-xxs-3">
                    <ColorCircle color={color} setColor={this.selectColor} />
                </div>
            )}
            </div>
            <button className="push" onClick={this.changeColorSet}>View More</button>
            <div className="clear"/>
        </div>
        </div>:"";

        var imgSelectionPopOver = this.state.imgSelectOpen?<div className="selection-popover">
        <div className="container">
            <button className="push" onClick={this.toggleImgSelect}>Cancel</button>
            <div className="clear"/>
            Select a sticker:
            <div className="row no-gutter">
            {this.getImages(this.state.getImageSet).map((img)=>
                <div className="col-xxs-4 col-s-3">
                    <ImagePicker img={img} setImg={this.selectImg} />
                </div>
            )}
            </div>
            <button className="push" onClick={this.changeColorSet}>View More</button>
            <div className="clear"/>
        </div>
        </div>:"";
       
    	var color = this.state.color;
        var style = {
        	borderTopWidth: '5px',
        	borderTopStyle: 'solid',
        	borderTopColor: color
        }
        var feedTitle = this.state.title;
        return <div className="group-details-popover" >

            <div className="container" style={style}>
                <div className="push">
                    <button className="" onClick={this.saveState}>Save</button>{" "}
                    <button className="" onClick={this.closeDetails}>Close</button>
                </div>
                <div className="clear" />
                <p>
                    <img className="" src={this.state.image} />
                </p>
                <input type="text" value={feedTitle} onChange={this.handleChange} />
                <div className="text-center">
                    <button onClick={this.toggleColorSelect}>Select a color</button>{" "}
                    <button onClick={this.toggleImgSelect}>Select a photo</button>
                </div>
            </div>
            {imgSelectionPopOver}
            {selectionPopOver}
        </div>
    }
});
