var React = require('react');
var RouterLink = require('project/router/components/RouterLink');

// these are labels for the days of the week
var cal_days_labels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

// these are human-readable month name labels, in order
var cal_months_labels = ['January', 'February', 'March', 'April',
                     'May', 'June', 'July', 'August', 'September',
                     'October', 'November', 'December'];

// these are the days of the week for each month, in order
var cal_days_in_month = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
function Calendar(month, year) {
  this.month = (isNaN(month) || month == null) ? cal_current_date.getMonth() : month;
  this.year  = (isNaN(year) || year == null) ? cal_current_date.getFullYear() : year;
  this.html = '';
}
Calendar.prototype.generateHTML = function(date){

  // get first day of month
  var firstDay = new Date(this.year, this.month, 1);
  var startingDay = firstDay.getDay();
  
  // find number of days in month
  var monthLength = cal_days_in_month[this.month];
  
  // compensate for leap year
  if (this.month == 1) { // February only!
    if((this.year % 4 == 0 && this.year % 100 != 0) || this.year % 400 == 0){
      monthLength = 29;
    }
  }
  
  // do the header
  var monthName = cal_months_labels[this.month]
  var html = '<table class="calendar-table">';
  html += '<tr><th colspan="7">';
  html +=  monthName + "&nbsp;" + this.year;
  html += '</th></tr>';
  html += '<tr class="calendar-header">';
  for(var i = 0; i <= 6; i++ ){
    html += '<td class="calendar-header-day">';
    html += cal_days_labels[i];
    html += '</td>';
  }
  html += '</tr><tr>';
  var today = new Date();
  // fill in the days
  var day = 1;
  var todayClass = "";
  // this loop is for is weeks (rows)
  for (var i = 0; i < 9; i++) {
    // this loop is for weekdays (cells)
    for (var j = 0; j <= 6; j++) { 

        if (day === date && this.month === today.getMonth() && this.year === today.getFullYear()) {
            todayClass = " today ";
        } else {
            todayClass = "";
        }
      html += '<td class="calendar-day'+todayClass+'" onClick="window.location = '+"'"+'/#/todos/'+this.year+'-'+(this.month+1)+'-'+day+"'"+';">';
      if (day <= monthLength && (i > 0 || j >= startingDay)) {
        html += day;
        day++;
      }
      html += '</td>';
    }
    // stop making rows if we've run out of days
    if (day > monthLength) {
      break;
    } else {
      html += '</tr><tr>';
    }
  }
  html += '</tr></table>';

  this.html = html;
}
Calendar.prototype.getHTML = function() {
  return this.html;
}

module.exports = React.createClass({
    nextMonth: function(x){
       x.stopPropagation();
      var date = this.state.date;
      data = date.setMonth(date.getMonth() +1);
      this.setState({date:date});
      cal.generateHTML(date);
    },
    prevMonth: function(x){
      x.stopPropagation();
      var date = this.state.date;
      data = date.setMonth(date.getMonth() -1);
      this.setState({date:date});
      cal.generateHTML(date);
    },
    goToDate:function(year,month,day){
      alert("hit")
    },
    closePopup: function(ev){
         console.log("doc clicked")
         this.props.closePopup(ev);
    },
    preventClosePopup: function(x){
      console.log(x);
        x.stopPropagation();
    },
    componentDidMount: function() {
        var that = this;
        //document.getElementById("header-todo-popout").addEventListener('click', this.preventClosePopup,false);
        //document.addEventListener('click', this.closePopup);
        console.log(this.getCalendar())
        
    },
    componentWillUnmount: function () {
        //document.getElementById("header-todo-popout").removeEventListener('click',this.preventClosePopup);
        //document.removeEventListener('click',this.closePopup);
        console.log("unmount")
    },
    getInitialState: function() {
        return {
          date: new Date()
        }
    },
    getCalendar: function(){
        var today = this.state.date;
        var cal = new Calendar(today.getMonth(),today.getFullYear());
        cal.generateHTML(today.getDate());
        return cal.getHTML();
    },
    render: function() {
        return <div className="header-todo-popout" id="header-todo-popout">
          <span className="push"><button onClick={this.prevMonth}><i className="icon-arrow-left"></i></button>&nbsp;<button onClick={this.nextMonth}><i className="icon-arrow-right"></i></button></span>
          <div dangerouslySetInnerHTML={{__html: this.getCalendar()}} />
          <div class="clear"></div>
        </div>
    }
});
