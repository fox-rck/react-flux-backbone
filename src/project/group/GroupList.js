var React = require('react');
var storeMixin = require('project/shared/helpers/storeMixin');
var GroupItem = require('project/group/GroupItem');
var GroupStore = require('project/group/GroupStore');
var GroupAction = require('project/group/GroupActions');
var ColorCircle = require('project/group/ColorCircle');
var ImagePicker = require('project/group/ImagePicker');
var appConstants = require('project/constants');

module.exports = React.createClass({
    mixins: [storeMixin(GroupStore)],
    getInitialState: function(){
        return {
            groupStore: GroupStore.getState()
            , addOpen:false
            , openAdvanced:false
            , colorSelectOpen: false
            , color: null
            , getColorSet: false
            , image: null
            , getImageSet: false
            , imgSelectOpen: false
        }
    },
    _onChange: function() {
        this.setState({groupStore:GroupStore.getState()});
    },
    getInitDataIfNeeded: function() {
        var meta = GroupStore.getState();
        if(meta.groups.length != 0){
           GroupAction.get({p:1});
        }
    },
	componentDidMount: function(){
		//Load Groups
        GroupAction.get({p:1});
	},
    addGroup: function(){
        var title = this.refs.title.getDOMNode().value;
        var item = {};
        if(title != ""){
            item.title = title;
            if(this.state.color != null){
                item.color = this.state.color;
            }
            if(this.state.image != null){
                item.photo = this.state.image;
            }
            GroupAction.add(item); 
        }
        this.toggleAdd();
    },
    toggleAdvanced: function(){
        this.setState({openAdvanced:!this.state.openAdvanced});
    },
    goToFavorites: function() {
        window.location = "/#/favorites";
    },
    toggleColorSelect: function() {
        this.setState({colorSelectOpen:!this.state.colorSelectOpen, imgSelectOpen: false, getColorSet: false});
    },
    toggleImgSelect: function() {
        this.setState({imgSelectOpen:!this.state.imgSelectOpen, colorSelectOpen: false, getColorSet: false});
    },
    toggleAdd: function(){
        if(this.state.addOpen === true){
             this.setState({openAdvanced:false,color:null,image:null});
        }
        this.setState({addOpen:!this.state.addOpen});

    },
    selectColor: function(color){
        this.setState({colorSelectOpen:!this.state.colorSelectOpen,color: color});
    },
    selectImg: function(img){
        this.setState({imgSelectOpen:false,image: img});
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
    render: function() {
        var colorSet = this.state.getColorSet;
        var colorStyle = this.state.color == null? {} :{
            borderTopSize: "3px"
            , borderStyle: "solid"
            , borderColor: this.state.color
        }
        var selectionPopOver = this.state.colorSelectOpen?<div className="selection-popover">
        <div className="container">
            <button className="push" onClick={this.toggleColorSelect}>Cancel</button>
            <div className="clear"/>
            Select a color:
            <div className="row no-gutter">
            {this.getColors(colorSet).map((color)=>
                <div className="col-xxs-4 col-s-3">
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
        var advanced = this.state.openAdvanced?<div>
            <button onClick={this.toggleColorSelect}>Select a color</button>{" "}
            <button onClick={this.toggleImgSelect}>Select a photo</button>
        </div>:"";
        var title = !this.state.openAdvanced?"Show advanced" : "Hide advanced"
        var addNew = this.state.addOpen? <div className="add-group" style={colorStyle}>
        <h3>Add a topic</h3>
        <div className="text-center">
        {this.state.image?<img src={this.state.image} /> :""}
        </div>
        <input type="text" ref="title" placeholder="New topic title" />
        {advanced}
        <p />
        <div className="clear"/>
        <button onClick={this.addGroup}>Add</button>{" "}
        <button  onClick={this.toggleAdd}>Cancel</button>
        <a href="javascript:;" className="push" onClick={this.toggleAdvanced}>{title}</a>
        {selectionPopOver}
        {imgSelectionPopOver}
        </div>:"";
        var addNewBtn = this.state.addOpen?"":<button className="add-new" onClick={this.toggleAdd}><i className="icon-plus" /></button>

      return <div className="scroll-box">
                <div className="row group-list">
                    <ul className='list-unstyled col-xxs-12'>
                        <li>
                            <button className="link-btn" onClick={this.goToFavorites}>
                                Favorites
                            </button>
                        </li>
                        {this.state.groupStore.groups.map((group)=>
                            <li key={"grp"+group._id}><GroupItem  group={group} /></li>
                        )}
                    </ul>
                </div>
            {addNewBtn}
            {addNew}
             
            </div>

    }
});
