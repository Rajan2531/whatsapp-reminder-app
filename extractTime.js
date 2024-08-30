const monthName=new Map([
    ["0","jan"],
    ["1","feb"],
    ["2","mar"],
    ["3","apr"],
    ["4","may"],
    ["5","jun"],
    ["6","jul"],
    ["7","aug"],
    ["8","sep"],
    ["9","oct"],
    ["10","nov"],
    ["11","dec"]
])

const extractTime = (msgBody) =>{

    const msgArray=msgBody.split(" ");
    let inputDateAndTime;
    let inputDate;
    let inputYear;
    let inputMonth;
    let inputTime;
    const date= new Date();
    if(msgArray[msgArray.length-3].toLowerCase()=="today")
    {
        inputDate=date.getDate();
        inputMonth=monthName.get((date.getMonth()).toString());
        inputYear=date.getFullYear();
        let timeFromMsgBody=msgArray[(msgArray.length-1)];
        timeFromMsgBody="00"+timeFromMsgBody;
        timeFromMsgBody=timeFromMsgBody.slice(timeFromMsgBody.length-5,timeFromMsgBody.length);
        if(timeFromMsgBody.includes('.'))
        timeFromMsgBody=timeFromMsgBody.replace('.',':');
        inputTime=timeFromMsgBody+":00";
        inputDateAndTime=inputMonth+" "+ inputDate + ", "+ inputYear+ " " +inputTime;
    
    
    }
    else if(msgArray[msgArray.length-3].toLowerCase()=="tomorrow")
    {
        let date1=new Date();
        date1.setDate(date1.getDate()+1);
        inputDate=date1.getDate();
        inputMonth=monthName.get((date1.getMonth()).toString());
        inputYear=date1.getFullYear();
        
        let timeFromMsgBody=msgArray[(msgArray.length-1)];
        timeFromMsgBody="00"+timeFromMsgBody;
        timeFromMsgBody=timeFromMsgBody.slice(timeFromMsgBody.length-5,timeFromMsgBody.length);
        if(timeFromMsgBody.includes('.'))
       timeFromMsgBody= timeFromMsgBody.replace('.',':');
        inputTime=timeFromMsgBody+":00";
        inputDateAndTime=inputMonth+" "+ inputDate + ", "+ inputYear+ " " +inputTime;
    
    
    }
    else
    {
        let receivedDate=msgArray[msgArray.length-3];
        while(receivedDate.includes('/')||receivedDate.includes('-')||receivedDate.includes(':'))
        {
        if(receivedDate.includes('/'))
        receivedDate=receivedDate.replace('/','.');
        if(receivedDate.includes(':'))
        receivedDate=receivedDate.replace(':','.');
        if(receivedDate.includes('-'))
        receivedDate=receivedDate.replace('-','.');
        }
        
      
        let recievedDateArray=receivedDate.split('.');
        let monthString=recievedDateArray[1]*1;
       
        inputDate=recievedDateArray[0];
    
        inputMonth=monthName.get((monthString-1).toString());
        inputYear=recievedDateArray[2];
        let timeFromMsgBody=msgArray[msgArray.length-1];
        timeFromMsgBody="00"+timeFromMsgBody;
        timeFromMsgBody=timeFromMsgBody.slice(timeFromMsgBody.length-5,timeFromMsgBody.length);
        if(timeFromMsgBody.includes("."))
        timeFromMsgBody=timeFromMsgBody.replace('.',':');
      
        inputTime=timeFromMsgBody+":00";
        inputDateAndTime=inputMonth+" "+ inputDate + ", "+ inputYear+ " " +inputTime;
        
        
    }
    return inputDateAndTime;
    }

module.exports = extractTime;