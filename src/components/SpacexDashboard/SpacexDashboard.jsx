import React, { Component } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import './SpacexDashboard.css';
import Loader from 'react-loader-spinner'

class SpacexDashboard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      launchData : [],
      yearFilter:"",
      launchFilter:"",
      landFilter:"",
      loader:""
    };
  }

  componentDidMount=async()=>{
    this.setState({'loader' : true})
    let LAUNCH_API = "https://api.spacexdata.com/v3/launches?limit=100";
    await axios.get(LAUNCH_API)
    .then(response => {
      if(response){
        if(response['status'] === 200){  
              console.log(response['data']);
              this.setState({'launchData' : response['data']});
              this.setState({'loader' : false});
        }
      }
    })
    .catch(error => {
      if(error.response){
        this.setState({'loader' : false});
      } 
    })
  }

  filterData=async(name , data)=>{
    if(name === 'year'){
      if(data === this.state['yearFilter']){
         await this.setState({'yearFilter' : ""});
      }else{
         await this.setState({'yearFilter' : data});
      }
    }else if(name === 'launch'){
      if(data === this.state['launchFilter']){
        await this.setState({'launchFilter' : ""});
      }else{
        await this.setState({'launchFilter' : data});
      }
    }else if(name === 'land'){
      if(data === this.state['landFilter']){
        await this.setState({'landFilter' : ""});
      }else{
        await this.setState({'landFilter' : data});
      }
    }
    this.setState({'loader' : true})
    let LAUNCH_API = "https://api.spacexdata.com/v3/launches?limit=100";

    if(this.state['yearFilter'] || this.state['landFilter'].toString() || this.state['launchFilter'].toString()){
      LAUNCH_API = LAUNCH_API+'&launch_success='+this.state['launchFilter']+'&land_success='+this.state['landFilter']+'&launch_year='+this.state['yearFilter']
    }
    await axios.get(LAUNCH_API)
    .then(response => {
      if(response){
        if(response['status'] === 200){  
            this.setState({'launchData' : response['data']});
            this.setState({'loader' : false});
        }
      }
    })
    .catch(error => {
      if(error.response){
        this.setState({'loader' : false});
      } 
    })
  }

  // MainContent=()=>{
  //   return <>
  // }

  render() {
    let launchYear = [2006,2007,2008,2009 ,2010 ,2011,2012,2013,2014,2015,2016,2017,2018,2019];
    const {launchData , yearFilter , launchFilter ,landFilter,loader} =  this.state;

    if(loader){
      return(
        <div  style={{display:'flex' , justifyContent:'center' , height:'530px' , alignItems : 'center'}}>
        <Loader
           type="Puff"
           color="#00BFFF"
           height={100}
           width={100}
        /></div>
       );
    }


    return (
      <>
      <div className="main-container">
          <header className="header">SpaceX Launch Programs</header>
        
          {/* ********** sidebar has filter ************ */}
            <aside className="sidebar">
                <div className="filter-header">Filters</div>
                <span className="filter-name">Launch Year</span>
                {launchYear.length>0 && <div className="filter-flex"> 
                  {launchYear.map((v,k)=>{
                     return (
                        <div className="filter-year-div" key={k}>
                          <a className="filter-year" onClick={()=>this.filterData("year",v)}
                          style={{'backgroundColor': yearFilter === v ? 'var(--selectedGreen)' : 'var(--green)'}}>{v}</a>
                        </div>
                    )
                  })}
                 </div>}
                
                 <span className="filter-name" style={{marginTop: '20px'}}>Successful Launch</span> 
                 <div className="filter-flex"> 
                    <div className="filter-year-div">
                      <a className="filter-year" onClick={()=>this.filterData("launch",true)} 
                        style={{'backgroundColor': launchFilter === true ? 'var(--selectedGreen)' : 'var(--green)'}}>true</a>
                    </div>
                    <div className="filter-year-div">
                      <a className="filter-year" onClick={()=>this.filterData("launch",false)}
                      style={{'backgroundColor': launchFilter === false ? 'var(--selectedGreen)' : 'var(--green)'}}>false</a>
                    </div>
                 </div>

                 <span className="filter-name" style={{marginTop: '20px'}}>Successful Landing</span> 
                 <div className="filter-flex"> 
                    <div className="filter-year-div">
                      <a className="filter-year" onClick={()=>this.filterData("land",true)}
                      style={{'backgroundColor': landFilter === true ? 'var(--selectedGreen)' : 'var(--green)'}}>true</a>
                    </div>
                    <div className="filter-year-div">
                      <a className="filter-year" onClick={()=>this.filterData("land",false)}
                      style={{'backgroundColor': landFilter === false ? 'var(--selectedGreen)' : 'var(--green)'}}>false</a>
                    </div>
                 </div>

            </aside>
            {/* ************ main content has all the launches ************ */}
            <main className="main-content">
              {launchData.length>0 && launchData.map((v,k)=> { 
                return (
                      <div className="launch-content" key={k}>
                          <div className="image-content">
                                <img className="launch-image" src={v['links']['mission_patch_small']}></img>    
                          </div>
                          <div className="launch-details">
                            <span className="mission-name">{v['mission_name']+' #'+(k+1)}</span>
 
                            {v['mission_id'].length>0 && <>
                            <span className="mission-details">Mission Ids:</span>
                             <ul className="mission-ids">
                                {v['mission_id'].map((vi,ki)=>{
                                     return (
                                        <li key={ki}>{vi}</li>
                                     )
                               })}
                            </ul></>}
                            <div style={{'marginTop':'10px'}}>
                                <span className="mission-key">Launch Year: </span>
                                <span className="mission-value">{v['launch_year']}</span>
                            </div>
                            <div style={{'marginTop':'10px'}}>
                                <span className="mission-key">Successful Launch:</span>
                                <span className="mission-value">{(v['launch_success'] != undefined || null || "")  ? v['launch_success'].toString() : '-'}</span>
                            </div>
                            <div style={{'marginTop':'10px'}}>
                              <span className="mission-key">Successful Landing:</span>
                              <span className="mission-value">{(v['rocket']['first_stage']['cores'][0]['land_success'] != undefined || null || "") ? v['rocket']['first_stage']['cores'][0]['land_success'].toString() : '-'}</span>
                            </div>
                          </div>
                      </div>)
              })}  

              {launchData.length === 0 && 
                  <div className="no-data-found">
                    <span>No Data Available</span>
                  </div>

              }
             
            </main>
            
       
        {/* ************** footer ************ */}
         <footer className="footer"> 
              <span style={{fontWeight:'bold'}}>Developed by:</span> <span>Romal Singla</span>
         </footer>
        
        
        
      </div>  
            
      </>

    );
  }
}


export default SpacexDashboard;
