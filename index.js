/* The below js script is used along with index.html for coursework 2 of F21DV */

//fetching the svg
var svgEducationalAttainmentMap = d3.select("#educationalAttainmentMap");
var svgCrimeMap=d3.select('#crimeMap');
var svgEducationalAttainmentByAge=d3.select('#educationLevelByAgeBarChart');
var svgEducationalAttainmentByRace=d3.select('#educationLevelByRaceBarChart');
var svgPositiveBarChart=d3.select('#positiveBarChart');


//loading all data
Promise.all([
  d3.csv("crimeAgainstPersons.csv"),
  d3.csv("crimeAgainstProperty.csv"),
  d3.csv("crimeAgainstSociety.csv"),
  d3.csv("educationalAttainmentByAge.csv"),
  d3.csv("educationalAttainmentByRace.csv"),
  d3.csv("states.csv"),
]).then(function (loadData) {
let crimeAgainstPersons=loadData[0];
let crimeAgainstProperty=loadData[1];
let crimeAgainstSociety=loadData[2];
let educationalAttainmentByAge=loadData[3];
let educationalAttainmentByRace=loadData[4];
let states=loadData[5];

// console.log("Crime against person : ",crimeAgainstPersons);
// console.log("Crime against Property :",crimeAgainstProperty);
// console.log("Crime against society : ",crimeAgainstSociety);
// console.log("educationalAttainmentByAge:", educationalAttainmentByAge);
// console.log("educationalAttainmentByRace : ",educationalAttainmentByRace);
// console.log("States : ",states);

//used to fetch state code using state name
const fetchStateName= new Map();
states.map(function(d){
  fetchStateName.set(d.name, d.abbreviation);
})

states.map(function(d){
  fetchStateName.set( d.abbreviation,d.name);
})

var stateCode = Array.from(fetchStateName.values());
stateCode=d3.filter(stateCode,d=>d.length==2)
// console.log(stateCode)


//Edu - Educational Attainment
//TE - Total Estimate

// Going to fetch all total estimates from both education datasets, add them together.
//highschool
const fetchEducationLevelAllAgeEachState = new Map();
const fetchEducationLevelAllRaceEachState = new Map();

//bachelors
const fetchEducationLevelAllAgeEachStateBachelors = new Map();
const fetchEducationLevelAllRaceEachStateBachelors= new Map();


//highSchools or higher
const fetchEducationLevelByRace = educationalAttainmentByRace.map(function(d){
  return {
    state:fetchStateName.get(d.state),
    total_estimate:d.total_estimate,

    //races and education levels
    white: +d.high_school_graduate_or_higher_white_alone_not_hispanic_or_latino ,
    allWhite:+d.high_school_graduate_or_higher_white,
    twoOrMore:+d.high_school_graduate_or_higher_two_or_more_races,
    black: +d.high_school_graduate_or_higher_black_alone,
    asian:+d.high_school_graduate_or_higher_asian_alone,
    hispanic_or_latino: +d.high_school_graduate_or_higher_hispanic_or_latino_origin,
    americanIndian_or_alaskaNative: +d.high_school_graduate_or_higher_american_indian_or_alaska_native_alone,
    other: +d.high_school_graduate_or_higher_some_other_race_alone,

    //population
    white_pop: +d.total_white_alone_not_hispanic_or_latino,
    allWhite_pop:+d.total_white,
    twoOrMore_pop:+d.total_two_or_more_races,
    black_pop:+d.total_black_alone,
    asian_pop:+d.total_asian_alone,
    hispanic_or_latino_pop: +d.total_hispanic_or_latino_origin,
    americanIndian_or_alaskaNative_pop: +d.total_american_indian_or_alaska_native_alone,
    other_pop: +d.total_some_other_race_alone,

    //percents
    percent_white: (+d.high_school_graduate_or_higher_white_alone_not_hispanic_or_latino/+d.total_white_alone_not_hispanic_or_latino)*100,
    percent_allWhite:(+d.high_school_graduate_or_higher_white/+d.total_white)*100,
    percent_twoOrMore:(+d.high_school_graduate_or_higher_two_or_more_races/+d.total_two_or_more_races)*100,
    percent_black: (+d.high_school_graduate_or_higher_black_alone/+d.total_black_alone)*100,
    percent_asian:(+d.high_school_graduate_or_higher_asian_alone/+d.total_asian_alone)*100,
    percent_hispanic_or_latino: (+d.high_school_graduate_or_higher_hispanic_or_latino_origin/+d.total_hispanic_or_latino_origin)*100,
    percent_americanIndian_or_alaskaNative: (+d.high_school_graduate_or_higher_american_indian_or_alaska_native_alone/+d.total_american_indian_or_alaska_native_alone)*100,
    percent_other: (+d.high_school_graduate_or_higher_some_other_race_alone/+d.total_some_other_race_alone)*100,
  }
});


(fetchEducationLevelByRace.filter(d=>d.total_estimate == 'Total Estimate')).map(function(d){
  //adding all races together
  let highSchoolsOrHigherAllRaces=d.white+d.allWhite+d.twoOrMore+d.black+d.asian+d.hispanic_or_latino+d.americanIndian_or_alaskaNative+d.other;
  let popCountOfAllRaces=d.white_pop+d.allWhite_pop+d.twoOrMore_pop+d.black_pop+d.asian_pop+d.hispanic_or_latino_pop+d.americanIndian_or_alaskaNative_pop+d.other_pop;
  let calcPerc=(highSchoolsOrHigherAllRaces/popCountOfAllRaces)*100;
  if(!isNaN(calcPerc))
  fetchEducationLevelAllRaceEachState.set(d.state, (Math.ceil(calcPerc*100)/100) );
})

const fetchEducationLevelByAge = educationalAttainmentByAge.map(function(d){
  return {
    state:fetchStateName.get(d.state),
    total_estimate:d.total_estimate,

    //Age groups
    // _18_to_24: +d.high_school_graduate_or_higher_18to24,   //value is NaN
    _25_to_34: +d.high_school_graduate_or_higher_25to34,
    _35_to_44:+d.high_school_graduate_or_higher_35to44,
    _45_to_64:+d.high_school_graduate_or_higher_45to64,
    greater_than_25:+d.high_school_graduate_or_higher__greater_than_25,
    greater_than_65:+d.high_school_graduate_or_higher__greater_than_65,

    //population
    // _18_to_24_pop: +d.total_18to24,      //value is NaN
    _25_to_34_pop: +d.total_25to34,
    _35_to_44_pop:+d.total_35to44,
    _45_to_64_pop:+d.total_45to64,
    greater_than_25_pop:+d.total_greater_than_25,
    greater_than_65_pop:+d.total_greater_than_65,

    //percentages
    percent_25_to_34:(+d.high_school_graduate_or_higher_25to34/+d.total_25to34)*100,
    percent_35_to_44:(+d.high_school_graduate_or_higher_35to44/+d.total_35to44)*100,
    percent_45_to_64:(+d.high_school_graduate_or_higher_45to64/+d.total_45to64)*100,
    percent_greater_than_25:(+d.high_school_graduate_or_higher__greater_than_25/+d.total_greater_than_25)*100,
    percent_greater_than_65:(+d.high_school_graduate_or_higher__greater_than_65/+d.total_greater_than_65)*100,
  }
});


(fetchEducationLevelByAge.filter(d=> d.total_estimate === 'Total Estimate')).map(function(d){

  //adding all ages together to compute the percentage
  let highSchoolsOrHigherAllAges=d._25_to_34+d._35_to_44+d._45_to_64+d.greater_than_25+d.greater_than_65;
  let popCountOfAllAges=d._25_to_34_pop+d._35_to_44_pop+d._45_to_64_pop+d.greater_than_25_pop+d.greater_than_65_pop;

  let calcPerc=(highSchoolsOrHigherAllAges/popCountOfAllAges)*100;
  if(!isNaN(calcPerc))
  fetchEducationLevelAllAgeEachState.set(d.state, (Math.ceil(calcPerc*100)/100) );

})

 //now need to find mean of all states
 var fetchEducationLevelEachState =   new Map();

 fetchEducationLevelAllRaceEachState.forEach(function(value, key) {
  if (fetchEducationLevelAllAgeEachState.has(key)) {
    var mean = (value + fetchEducationLevelAllAgeEachState.get(key)) / 2;
    fetchEducationLevelEachState.set(key, mean);
  }
});


//bachelors or higher
const fetchEducationLevelByRaceBachelors = educationalAttainmentByRace.map(function(d){
  return {
    state:fetchStateName.get(d.state),
    total_estimate:d.total_estimate,

    //races and education levels
    white: +d.bachelors_degree_or_higher_white_alone_not_hispanic_or_latino ,
    allWhite:+d.bachelors_degree_or_higher_white,
    twoOrMore:+d.bachelors_degree_or_higher_two_or_more_races,
    black: +d.bachelors_degree_or_higher_black_alone,
    asian:+d.bachelors_degree_or_higher_asian_alone,
    hispanic_or_latino: +d.bachelors_degree_or_higher_hispanic_or_latino_origin,
    americanIndian_or_alaskaNative: +d.bachelors_degree_or_higher_american_indian_or_alaska_native_alone,
    other: +d.bachelors_degree_or_higher_some_other_race_alone,

    //population
    white_pop: +d.total_white_alone_not_hispanic_or_latino,
    allWhite_pop:+d.total_white,
    twoOrMore_pop:+d.total_two_or_more_races,
    black_pop:+d.total_black_alone,
    asian_pop:+d.total_asian_alone,
    hispanic_or_latino_pop: +d.total_hispanic_or_latino_origin,
    americanIndian_or_alaskaNative_pop: +d.total_american_indian_or_alaska_native_alone,
    other_pop: +d.total_some_other_race_alone,

    //percents
    percent_white: (+d.bachelors_degree_or_higher_white_alone_not_hispanic_or_latino/+d.total_white_alone_not_hispanic_or_latino)*100,
    percent_allWhite:(+d.bachelors_degree_or_higher_white/+d.total_white)*100,
    percent_twoOrMore:(+d.bachelors_degree_or_higher_two_or_more_races/+d.total_two_or_more_races)*100,
    percent_black: (+d.bachelors_degree_or_higher_black_alone/+d.total_black_alone)*100,
    percent_asian:(+d.bachelors_degree_or_higher_asian_alone/+d.total_asian_alone)*100,
    percent_hispanic_or_latino: (+d.bachelors_degree_or_higher_hispanic_or_latino_origin/+d.total_hispanic_or_latino_origin)*100,
    percent_americanIndian_or_alaskaNative: (+d.bachelors_degree_or_higher_american_indian_or_alaska_native_alone/+d.total_american_indian_or_alaska_native_alone)*100,
    percent_other: (+d.bachelors_degree_or_higher_some_other_race_alone/+d.total_some_other_race_alone)*100,
  }
});


(fetchEducationLevelByRaceBachelors.filter(d=>d.total_estimate == 'Total Estimate')).map(function(d){

  //adding all races together to compute percentage
  let highSchoolsOrHigherAllRaces=d.white+d.allWhite+d.twoOrMore+d.black+d.asian+d.hispanic_or_latino+d.americanIndian_or_alaskaNative+d.other;
  let popCountOfAllRaces=d.white_pop+d.allWhite_pop+d.twoOrMore_pop+d.black_pop+d.asian_pop+d.hispanic_or_latino_pop+d.americanIndian_or_alaskaNative_pop+d.other_pop;
  let calcPerc=(highSchoolsOrHigherAllRaces/popCountOfAllRaces)*100;
  if(!isNaN(calcPerc))
  fetchEducationLevelAllRaceEachStateBachelors.set(d.state, (Math.ceil(calcPerc*100)/100) );
})


const fetchEducationLevelByAgeBachelors = educationalAttainmentByAge.map(function(d){
  return {
    state:fetchStateName.get(d.state),
    total_estimate:d.total_estimate,

    //age group
    // _18_to_24: +d.bachelors_degree_or_higher_18to24,   //value is NaN
    _25_to_34: +d.bachelors_degree_or_higher_25to34,
    _35_to_44:+d.bachelors_degree_or_higher_35to44,
    _45_to_64:+d.bachelors_degree_or_higher_45to64,
    greater_than_25:+d.bachelors_degree_or_higher__greater_than_25,
    greater_than_65:+d.bachelors_degree_or_higher__greater_than_65,

    //population
    // _18_to_24_pop: +d.total_18to24,      //value is NaN
    _25_to_34_pop: +d.total_25to34,
    _35_to_44_pop:+d.total_35to44,
    _45_to_64_pop:+d.total_45to64,
    greater_than_25_pop:+d.total_greater_than_25,
    greater_than_65_pop:+d.total_greater_than_65,

    //percentages
    percent_25_to_34:(+d.bachelors_degree_or_higher_25to34/+d.total_25to34)*100,
    percent_35_to_44:(+d.bachelors_degree_or_higher_35to44/+d.total_35to44)*100,
    percent_45_to_64:(+d.bachelors_degree_or_higher_45to64/+d.total_45to64)*100,
    percent_greater_than_25:(+d.bachelors_degree_or_higher__greater_than_25/+d.total_greater_than_25)*100,
    percent_greater_than_65:(+d.bachelors_degree_or_higher__greater_than_65/+d.total_greater_than_65)*100,
  }
});


(fetchEducationLevelByAgeBachelors.filter(d=> d.total_estimate === 'Total Estimate')).map(function(d){

  //adding all ages together to compute percentage
  let bachelorsOrHigherAllAges=d._25_to_34+d._35_to_44+d._45_to_64+d.greater_than_25+d.greater_than_65;
  let popCountOfAllAges=d._25_to_34_pop+d._35_to_44_pop+d._45_to_64_pop+d.greater_than_25_pop+d.greater_than_65_pop;

  let calcPerc=(bachelorsOrHigherAllAges/popCountOfAllAges)*100;
  if(!isNaN(calcPerc))
  fetchEducationLevelAllAgeEachStateBachelors.set(d.state, (Math.ceil(calcPerc*100)/100) );
})

 //now need to find mean of all states
 var fetchEducationLevelEachStateBachelors =   new Map();

 fetchEducationLevelAllRaceEachStateBachelors.forEach(function(value, key) {
  if (fetchEducationLevelAllAgeEachStateBachelors.has(key)) {
    var mean = (value + fetchEducationLevelAllAgeEachStateBachelors.get(key)) / 2;
    fetchEducationLevelEachStateBachelors.set(key, mean);
  }
});


fetchEducationLevelAllAgeEachState.delete(undefined);
fetchEducationLevelAllRaceEachState.delete(undefined);
fetchEducationLevelAllAgeEachStateBachelors.delete(undefined);
fetchEducationLevelAllRaceEachStateBachelors.delete(undefined);
fetchEducationLevelEachState.delete(undefined);
fetchEducationLevelEachStateBachelors.delete(undefined);

// console.log("fetchEducationLevelAllAgeEachState");
// console.log(fetchEducationLevelAllAgeEachState);
// console.log("fetchEducationLevelAllRaceEachState");
// console.log(fetchEducationLevelAllRaceEachState);

// console.log("fetchEducationLevelAllAgeEachStateBachelors");
// console.log(fetchEducationLevelAllAgeEachStateBachelors);
// console.log("fetchEducationLevelAllRaceEachStateBachelors");
// console.log(fetchEducationLevelAllRaceEachStateBachelors);


/**
 * These two are to be used mainly for most visualisations
 */

// console.log("fetchEducationLevelEachState");
// console.log(fetchEducationLevelEachState);
// console.log("fetchEducationLevelEachStateBachelors");
// console.log(fetchEducationLevelEachStateBachelors);

// For High School and Bachelor graduates.
// Finding median, then splitting states into two -> having more graduates, having less graduates for both high school and bachelors

/**
 * HIGH SCHOOL MEDIAN SPLITS
 */

const valuesArray = Array.from(fetchEducationLevelEachState.values());
const medianHighSchool = d3.median(valuesArray);
// console.log(medianHighSchool);


// Split the values into two groups using d3.quantile
const lowerMedianHighSchool = valuesArray.filter((d) => d < medianHighSchool);
const higherMedianHighSchool = valuesArray.filter((d) => d >= medianHighSchool);

// Get the state codes of the lower and higher groups
const lowerCodesHighSchool = Array.from(fetchEducationLevelEachState.keys()).filter((key) => lowerMedianHighSchool.includes(fetchEducationLevelEachState.get(key)));
const higherCodesHighSchool = Array.from(fetchEducationLevelEachState.keys()).filter((key) => higherMedianHighSchool.includes(fetchEducationLevelEachState.get(key)));


/**
 * BACHELORS MEDIAN SPLITS
 */

const valuesArrayBachelors = Array.from(fetchEducationLevelEachStateBachelors.values());
const medianBachelors = d3.median(valuesArrayBachelors);
// console.log(medianBachelors);


// Split the values into two groups using d3.quantile
const lowerMedianBachelors = valuesArrayBachelors.filter((d) => d < medianBachelors);
const higherMedianBachelors = valuesArrayBachelors.filter((d) => d >= medianBachelors);

// Get the state codes of the lower and higher groups
const lowerCodesBachelors = Array.from(fetchEducationLevelEachStateBachelors.keys()).filter((key) => lowerMedianBachelors.includes(fetchEducationLevelEachStateBachelors.get(key)));
const higherCodesBachelors = Array.from(fetchEducationLevelEachStateBachelors.keys()).filter((key) => higherMedianBachelors.includes(fetchEducationLevelEachStateBachelors.get(key)));



//fetching crime total for all states from crime datasets, later finding mean.
crimeAgainstPersonsTotalEachState =   new Map();
crimeAgainstPersons.map(function(d){
  if(d.state!='Total')
  crimeAgainstPersonsTotalEachState.set(fetchStateName.get(d.state),((+d.total_offenses/+d.population_covered)*100000));
})

crimeAgainstPropertyTotalEachState =   new Map();
crimeAgainstProperty.map(function(d){
  if(d.state!='Total')
  crimeAgainstPropertyTotalEachState.set(fetchStateName.get(d.state),((+d.total_offenses/+d.population_covered)*100000));
})

crimeAgainstSocietyTotalEachState =   new Map();
crimeAgainstSociety.map(function(d){
  if(d.state!='Total')
  crimeAgainstSocietyTotalEachState.set(fetchStateName.get(d.state),((+d.total_offenses/+d.population_covered)*100000));
})

// console.log(crimeAgainstPersonsTotalEachState)
// console.log(crimeAgainstPropertyTotalEachState)
// console.log(crimeAgainstSocietyTotalEachState)

crimeAgainstPersonsTotalEachState.delete(undefined);
crimeAgainstPropertyTotalEachState.delete(undefined);
crimeAgainstSocietyTotalEachState.delete(undefined);


 //now need to find mean of all states
 var fetchCrimeLevelEachState =   new Map();

 crimeAgainstPersonsTotalEachState.forEach(function(value, key) {
  if (crimeAgainstPersonsTotalEachState.has(key) && key !=undefined) {
    var mean = (value + crimeAgainstPropertyTotalEachState.get(key)+crimeAgainstSocietyTotalEachState.get(key))  / 3;
    fetchCrimeLevelEachState.set(key, mean);
  }
});
// console.log(fetchCrimeLevelEachState)

fetchCrimeLevelEachState.delete(undefined);


// console.log("Medians")
// console.log(lowerCodesHighSchool);
// console.log(higherCodesHighSchool);
// console.log(lowerCodesBachelors);
// console.log(higherCodesBachelors);

//now need to take the mean of crime rates lower and higher for both
//inorder to do that, crime rates need to be fetched for each state, the state then needs to be cross checked to verify if it is in lower or higher code.

var filterLowerCodeHighSchool=d3.filter(fetchCrimeLevelEachState,d=>lowerCodesHighSchool.includes(d[0]))
var meanOfFilterLowerCodeHighSchool=d3.mean(filterLowerCodeHighSchool,d=>d[1])
var filterHigherCodeHighSchool=d3.filter(fetchCrimeLevelEachState,d=>higherCodesHighSchool.includes(d[0]))
var meanOfFilterHigherCodeHighSchool=d3.mean(filterHigherCodeHighSchool,d=>d[1])

var filterLowerCodeBachelors=d3.filter(fetchCrimeLevelEachState,d=>lowerCodesBachelors.includes(d[0]))
var meanOfFilterLowerCodeBachelors=d3.mean(filterLowerCodeBachelors,d=>d[1])
var filterHigherCodeBachelors=d3.filter(fetchCrimeLevelEachState,d=>higherCodesBachelors.includes(d[0]))
var meanOfFilterHigherCodeBachelors=d3.mean(filterHigherCodeBachelors,d=>d[1])

//creating a map variable
var extentBarChart=d3.extent([meanOfFilterLowerCodeHighSchool,meanOfFilterHigherCodeHighSchool,meanOfFilterLowerCodeBachelors,meanOfFilterHigherCodeBachelors])
// console.log("extent")
// console.log(extentBarChart[1])

//type vs crime
var barChartData = [
  {name: "Higher High School Graduates", value: meanOfFilterHigherCodeHighSchool},
  {name: "Lower High School Graduates", value: meanOfFilterLowerCodeHighSchool},
  {name: "Higher Bachelor Graduates", value: meanOfFilterHigherCodeBachelors},
  {name: "Lower Bachelor Graduates", value: meanOfFilterLowerCodeBachelors}
];

// console.log("barChartData")
// console.log(barChartData)

// svgPositiveBarChart
createBarChart(svgPositiveBarChart,barChartData)

function createBarChart(div, data) {

  // set the dimensions and margins of the graph
  var width = d3.select('.visual').style('width');
  var height = d3.select('.visual').style('height');
  width = parseInt(width, 10);
  height = parseInt(height, 10);


  const margin = {top: 30, right: 40, bottom: 80, left: 220};
  height = height - margin.top - margin.bottom,
  width = width - margin.left - margin.right;

  // append the svg object to the body of the page
  const svg = div.select("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

  // Parse the Data

  // Y axis
  const y = d3.scaleBand()
      .range([0, height])
      .domain(data.map(d => d.name))
      .padding(0.2);
  svg.append("g")
      .call(d3.axisLeft(y).ticks(5))
      .selectAll("text")
      .attr("transform", "translate(-10,0)");

  // Add X axis
  const x = d3.scaleLinear()
      .domain([0, extentBarChart[1]])
      .range([0, width]);
  svg.append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x).ticks(5));

  // X axis label
  svg.append("text")
      .attr("text-anchor", "end")
      .attr("x", width-80)
      .attr("y", height + margin.top + 20)
      .text("Crime Rate (per 1000 people)");

  // Y axis label
  svg.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left + 20)
      .attr("x", 0 - (height / 2))
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .text("Group Of States");

  // Bars
  svg.selectAll("mybar")
      .data(data)
      .join("rect")
      .attr("x", x(0))
      .attr("y", d => y(d.name))
      .attr("width", d => x(d.value))
      .attr("height", y.bandwidth())
      .attr("class", function(d){
        if(d.name=='Higher High School Graduates' ||d.name =='Lower High School Graduates')
        return "highSchool";
        else
        return "bachelors";
      })

      var highSchoolClass=d3.selectAll('.highSchool');
      highSchoolClass.on('mouseover',function(){
        highSchoolClass.transition().duration(400).style('fill','white')
      })
      highSchoolClass.on('mouseout',function(){
        highSchoolClass.transition().duration(400).style('fill','#0052A3')
      })

      var bachelorClass=d3.selectAll('.bachelors');
      bachelorClass.on('mouseover',function(){
        bachelorClass.transition().duration(400).style('fill','white')
      })
      bachelorClass.on('mouseout',function(){
        bachelorClass.transition().duration(400).style('fill','#001429')
      })

    }

  /**
   * The below two datasets are used and combined for later use.
   * fetchEducationLevelEachState
   * fetchCrimeLevelEachState
   */

// Create a new map to combine the two maps by state
var combinedMap = new Map();

// Iterate over the keys of the education level map
for (let state of fetchEducationLevelEachState.keys()) {
  // Check if the state is also present in the crime level map
  if(state!=undefined){
  if (fetchCrimeLevelEachState.has(state)) {
    // Retrieve the education level and crime level for the state
    let education = fetchEducationLevelEachState.get(state);
    let crime = fetchCrimeLevelEachState.get(state);

    // Add the education level and crime level to the new map
    combinedMap.set(state, { education, crime });
  }
}
}

createMapOfUSA(svgEducationalAttainmentMap,fetchEducationLevelEachState,"education");
createMapOfUSA(svgCrimeMap,fetchCrimeLevelEachState,"crime")

// The below code adds tooltips to both the maps, and the scatterplot. The tooltip is iteself another visualisation - pie chart.

var educationDiv = d3.select("#educationDiv");
var crimeDiv = d3.select("#crimeDiv");
var educationAndCrimeScatterDiv=d3.select('#educationAndCrimeScatterDiv');

educationDiv
    .append("div")
    .attr("id", "toolTipEducation")
    .style("position", "absolute")
    .classed("toolTipEducation", true)
    .style("visibility", "hidden")
    .style("background-color", "white")
    .style("border", "solid")
    .style("border-width", "1px")
    .style("border-radius", "5px")
    .style("padding", "10px")
    .html(
      '<div class="toolTipEducation"><p id="stateTip"></p><p id="percentCenter"></p><svg id="svgToolTip" width="100" height="100"></svg></div>'
    );

    crimeDiv
    .append("div")
    .attr("id", "toolTipCrime")
    .style("position", "absolute")
    .classed("toolTipCrime", true)
    .style("visibility", "hidden")
    .style("background-color", "white")
    .style("border", "solid")
    .style("border-width", "1px")
    .style("border-radius", "5px")
    .style("padding", "10px")
    .html(
      '<div class="toolTipCrime"><p id="stateTip"></p><p id="percentCenter"></p><svg id="svgToolTip" width="100" height="100"></svg></div>'
    );

    educationAndCrimeScatterDiv
    .append("div")
    .attr("id", "toolTipEducationCrime")
    .style("position", "absolute")
    .classed("toolTipEducationCrime", true)
    .style("visibility", "hidden")
    .style("background-color", "white")
    .style("border", "solid")
    .style("border-width", "1px")
    .style("border-radius", "5px")
    .style("padding", "10px")
    .html(
      '<div class="toolTipEducationCrime"><p id="stateTip"></p><svg id="svgToolTip" width="100" height="100"></svg><br><div style="display: flex; flex-direction: column; align-items: center"><svg width="10" height="10"><rect width="100" height="100" style="fill: #00478f" /></svg><p id="education"></p><svg width="10" height="10"><rect width="100" height="100" style="fill: red" /></svg><p id="crime"></p></div></div>'
    );


    function addToolTipEducationMap() {
      d3.select("#toolTipEducation").style("visibility", "visible");
    }
    function removeToolTipEducationMap() {
      d3.select("#toolTipEducation").style("visibility", "hidden");
    }

    function addToolTipCrimeMap() {
      d3.select("#toolTipCrime").style("visibility", "visible");
    }
    function removeToolTipCrimeMap() {
      d3.select("#toolTipCrime").style("visibility", "hidden");
    }

    function addToolTipEducationCrime() {
      d3.select("#toolTipEducationCrime").style("visibility", "visible");
    }
    function removeToolTipEducationCrime() {
      d3.select("#toolTipEducationCrime").style("visibility", "hidden");
    }

// Adding functionality for on click, mouse over, mouse out, mouse move

svgEducationalAttainmentMap.on('mouseover',function(d){

  let stateSelected=d.target;
  let state = stateSelected.id.replace(/_education/g, "");
  if(state.length==2)
  {
    // d3.select('#'+stateSelected.id).transition().duration(100).style('opacity','0');
    addToolTipEducationMap();
  }
})


svgEducationalAttainmentMap.on('mouseout',function(d){

  let stateSelected=d.target;
  let state = stateSelected.id.replace(/_education/g, "");
  if(state.length==2)
  {
  d3.select('#'+stateSelected.id).transition().duration(800).style('opacity','1');
  removeToolTipEducationMap();
}
})


svgEducationalAttainmentMap.on('mousemove',function(d){

  let stateSelected=d.target;
   //removing "_education"
   let state = stateSelected.id.replace(/_education/g, "");
  //  console.log(state); // "AK"
  //  console.log(fetchStateName.get(state))

  if(state.length==2)
  {
    // console.log(stateSelected)
  d3.select('#'+stateSelected.id).transition().duration(50).style('opacity','0');
  // addToolTipEducationMap();


  // Adding functionality for movement of the tool tip.


var divNodeEducation = svgEducationalAttainmentMap.node(); // get the DOM node of the selected div
var rectEducation = divNodeEducation.getBoundingClientRect(); // get the size and position of the div relative to the viewport
var topEducation = rectEducation.top + window.scrollY; // add the current scroll position to get the top screen coordinate
var leftEducation = rectEducation.left + window.scrollX; // add the current scroll position to get the left screen coordinate

  var toolTipEducation = d3
  .select("#toolTipEducation")
  .style("top", event.pageY - topEducation + 105+ "px")
  .style("left", event.pageX - leftEducation + 15 + "px");

toolTipEducation.select('#stateTip').text(fetchStateName.get(state));

//Adding pie chart.

var svgToolTip = toolTipEducation.select("#svgToolTip");
const svgToolTipWidth = +svgToolTip.attr("width");
const svgToolTipHeight = +svgToolTip.attr("height");

// // This is the D3 Margin Convention.
var margin = { top: 50, right: 20, bottom: 20, left: 50 };
var innerWidth = svgToolTipWidth - margin.left - margin.right; //this is the width of the barchart
var innerHeight = svgToolTipHeight - margin.top - margin.bottom; // this is the height of the barchart

// append the svg object to the body of the page
var svg = svgToolTip
  .append("g")
  .attr("transform", `translate(${margin.left},${margin.top})`);

var percentageOfEducationalAttainment =fetchEducationLevelAllAgeEachState.get(state);

var remainingPerc = 100 - percentageOfEducationalAttainment;
const color = d3.scaleOrdinal().range(["#0052A3", "lightblue"]);
// .range(['#005CB8','#0052A3','#00478F','#003D7A','#003366', '#002952', '#001429']);

//percentCenter
toolTipEducation.select('#percentCenter').text(percentageOfEducationalAttainment +" %");

//this function draws the pie chart.
drawPieChart(
  svg,
  {
    a: percentageOfEducationalAttainment,
    c: remainingPerc,
  },
  "toolTipEducation",
  innerHeight,
  innerWidth,
  color
);
}

})


function drawPieChart(
  svg,
  data,
  typeOfPieChart,
  innerHeight,
  innerWidth,
  color
) {
  var radius = Math.min(innerWidth, innerHeight) / 2;

  // Compute the position of each group on the pie
  const pie = d3
    .pie()
    .value((d) => d[1])
    .startAngle(-2 * Math.PI)
    .endAngle((3 * Math.PI) / 2);

  const data_ready = pie(Object.entries(data));
  var g = svg.append("g");
  var update = g.selectAll("path").data(data_ready);

  if (typeOfPieChart == "normal") {
    var innerRadius = 100;
    var outerRadius = 25;
  } else {
    var innerRadius = 20;
    var outerRadius = -35;
  }
  // Build the pie chart: Basically, each part of the pie is a path that we build using the arc function.
  update
    .join("path")
    .merge(update)
    .attr("id", (d) => d.data[0])
    .attr(
      "d",
      d3
        .arc()
        .innerRadius(innerRadius) // This is the size of the donut hole
        .outerRadius(radius - outerRadius)
    )
    .attr("fill", (d) => color(d.data[0]))
    .attr("stroke", "white")
    .style("stroke-width", "1px")
    .style("opacity", 1)
    .on("mouseover", function (d) {
      // console.log("mouse over");
      d3.select(this).classed("highlightArc", true);
      classToSelect = d3.select(this).attr("id");
      d3.selectAll("." + classToSelect).classed("highlightArcStroke", true);
    })
    .on("mouseout", function (d) {
      d3.select(this).classed("highlightArc", false);
      d3.selectAll("." + classToSelect).classed(
        "highlightArcStroke",
        false
      );
    });

  update.exit().remove();
}


// Adding functionality for mouseover, mouseout, mousemove.

svgCrimeMap.on('mouseover',function(d){
  let stateSelected=d.target;

  let state = stateSelected.id.replace(/_crime/g, "");
  //the below check is done to verify if user is hovering over any of the states which has a two character state code.
  if(state.length==2){
    d3.select('#'+stateSelected.id).transition().duration(100).style('opacity','0');
  // console.log(stateSelected.id)
  addToolTipCrimeMap();
  }


})

svgCrimeMap.on('mousemove',function(d){
  let stateSelected=d.target;
  let state = stateSelected.id.replace(/_crime/g, "");
  if(state.length==2){
    d3.select('#'+stateSelected.id).transition().duration(50).style('opacity','0');

   var divNodeCrime = svgCrimeMap.node(); // get the DOM node of the selected div
   var rectCrime = divNodeCrime.getBoundingClientRect(); // get the size and position of the div relative to the viewport
   var topCrime = rectCrime.top + window.scrollY; // add the current scroll position to get the top screen coordinate
   var leftCrime = rectCrime.left + window.scrollX; // add the current scroll position to get the left screen coordinate

   var toolTipCrime = d3
   .select("#toolTipCrime")
   .style("top", event.pageY - topCrime + 105+ "px")
   .style("left", event.pageX - leftCrime - 50 + "px");

   toolTipCrime.select('#stateTip').text(fetchStateName.get(state));

   //need to add pie chart

   var svgToolTip = toolTipCrime.select("#svgToolTip");
   const svgToolTipWidth = +svgToolTip.attr("width");
   const svgToolTipHeight = +svgToolTip.attr("height");

   // // This is the D3 Margin Convention.
   var margin = { top: 50, right: 20, bottom: 20, left: 50 };
   var innerWidth = svgToolTipWidth - margin.left - margin.right; //this is the width of the barchart
   var innerHeight = svgToolTipHeight - margin.top - margin.bottom; // this is the height of the barchart

   // append the svg object to the body of the page
   var svg = svgToolTip
     .append("g")
     .attr("transform", `translate(${margin.left},${margin.top})`);

   var crimeRate =fetchCrimeLevelEachState.get(state)/100;
    crimeRate=crimeRate.toFixed(2);
   var remainingPerc = 100 - crimeRate;
   const color = d3.scaleOrdinal().range(["red", "pink"]);

   //percentCenter
   toolTipCrime.select('#percentCenter').text(crimeRate +" crimes per 1000 people");

   drawPieChart(
     svg,
     {
       a: crimeRate,
       c: remainingPerc,
     },
     "toolTipEducation",
     innerHeight,
     innerWidth,
     color
   )

  }
})

svgCrimeMap.on('mouseout',function(d){
  let stateSelected=d.target;
  removeToolTipCrimeMap();
  let state = stateSelected.id.replace(/_crime/g, "");
  if(state.length==2){
    d3.select('#'+stateSelected.id).transition().duration(800).style('opacity','1');

    removeToolTipCrimeMap();
}
})


// this function draws the map of the USA
function createMapOfUSA(svg,passedData,type)
{

  // console.log("data for map ");
  var statesInData=Array.from(passedData.keys());
  // console.log(statesInData);

  // adding 0 for NaN values.
  // console.log(stateCode);

  const missingStates = stateCode.filter(state => !statesInData.includes(state));
  // console.log("missingStates");
  // console.log(missingStates);
for (let index = 0; index < missingStates.length; index++) {
  passedData.set(missingStates[index],0)
}
// console.log(passedData)

  var width=d3.select('.visual').style('width');
  var height=d3.select('.visual').style('height');
  width=parseInt(width,10);
  height=parseInt(height,10);
    // console.log(width);
    // console.log(height);

    let margin = { top: 0, right: 120, bottom: 10, left: 50 };
    width = width - margin.left - margin.right,
    height = height - margin.top - margin.bottom;

  let projection = d3.geoAlbersUsa()
    .scale(700)
    .translate([width / 1.85, height / 2]);

  const path = d3.geoPath()
    .projection(projection);

  svg
    .style("width", width + margin.left + margin.right)
    .style("height", height + margin.top + margin.bottom)

  const map = svg.append('g')
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
    .attr('class', 'map')

  d3.json("https://unpkg.com/us-atlas@3.0.0/states-10m.json").then(function (usa) {

//  console.log(usa);
var setDomain=passedData.values();

for (let i = 0; i < setDomain.length; i++) {
  if (isNaN(arr[i])) {
    arr[i] = 0;
  }
}

// console.log("setDomain");
// console.log(setDomain);
// console.log(type)

//sets a different color scale for crime and education
if(type=='crime'){
var colorScale = d3.scaleThreshold()
  .domain(setDomain)
  .range(d3.schemeReds[5]);

  // .range(['#005CB8','#0052A3','#00478F','#003D7A','#003366', '#002952', '#001429']);
}else if (type=='education'){
  var colorScale = d3.scaleThreshold()
  .domain(setDomain)
  // .range(d3.schemeBlues[7]);
  .range(['#005CB8','#0052A3','#00478F','#003D7A','#003366', '#002952', '#001429']);

}

    map.selectAll('path')
    .data(topojson.feature(usa, usa.objects.states).features)
    .enter().append("path")
    .attr("d", path)
    .attr("id",function(d){return (fetchStateName.get(d.properties.name)) +"_"+type
    })
    .attr("class", "outline")
    .attr("fill","white")
    .attr("stroke", "#FCAF3C")
    // set the color of each state
    .attr("fill", function (d) {
    let temp=passedData.get(fetchStateName.get( d.properties.name)) || 0;
  return colorScale(temp);

})

/**
 * Adding legend to both maps
 */

const legend = svgCrimeMap
  .append("g")
  .attr("class", "legend")
  .attr("transform", "translate(520, 350)"); // Adjust the x and y position as needed

const legendItems = legend.append('g')
  .attr("transform", `translate(0, 10)`);

  const gradient = svgCrimeMap.append("defs")
  .append("linearGradient")
  .attr("id", "gradient")
  .attr("x1", "0%")
  .attr("y1", "0%")
  .attr("x2", "100%")
  .attr("y2", "0%");

gradient.append("stop")
  .attr("offset", "0%")
  .attr("stop-color", d3.schemeReds[5][0]);

gradient.append("stop")
  .attr("offset", "100%")
  .attr("stop-color",d3.schemeReds[5][4]);

legendItems.append("rect")
  .attr("width", 105)
  .attr("height", 15)
  .attr("fill", "url(#gradient)")
  .attr("class", "gradient-rect");

legendItems.append("text")
.style('fill','white')
  .text("Low")
  .attr("x", 0)
  .attr("y", 32);
  legendItems.append("text")
  .style('fill','white')
    .text("High")
    .attr("x", 70)
    .attr("y", 32);



const legendEdu = svgEducationalAttainmentMap
.append("g")
.attr("class", "legendEdu")
.attr("transform", "translate(520, 350)");

const legendItemsEdu = legendEdu.append('g')
.attr("transform", `translate(0, 10)`);

const gradientEdu = svgEducationalAttainmentMap.append("defs")
.append("linearGradient")
.attr("id", "gradientEdu")
.attr("x1", "0%")
.attr("y1", "0%")
.attr("x2", "100%")
.attr("y2", "0%");

gradientEdu.append("stop")
.attr("offset", "0%")
.attr("stop-color", "#005CB8");

gradientEdu.append("stop")
.attr("offset", "100%")
.attr("stop-color","#001429");

legendItemsEdu.append("rect")
.attr("width", 105)
.attr("height", 15)
.attr("fill", "url(#gradientEdu)")

legendItemsEdu.append("text")
.style('fill','white')
.text("Low")
.attr("x", 0)
.attr("y", 32);
legendItemsEdu.append("text")
.style('fill','white')
  .text("High")
  .attr("x", 70)
  .attr("y", 32);

})

}



//fetch education and crime of each state
const svgEducationAndCrime=d3.select('#scatterPlot');

//this function is called to draw the scatterplot
drawScatterPlot(svgEducationAndCrime,combinedMap);

//the functionality for mouseover, mouseout, and mousemove have been added below for scatterplot.
svgEducationAndCrime.on('mouseover',function(d){
    let stateSelected=d.target;
  if(stateSelected.id.length==2){
  addToolTipEducationCrime();
  }
})

svgEducationAndCrime.on('mouseout',function(d){
  removeToolTipEducationCrime();
  let stateSelected=d.target;
  if(stateSelected.id.length==2){
  removeToolTipEducationCrime();
  }
})

//adding mousehover to scatterplot
svgEducationAndCrime.on('mousemove',function(d){

  let stateSelected=d.target;
if(stateSelected.id.length==2){
  addToolTipEducationCrime();

  let state = stateSelected.id.replace(/_crime/g, "");
  //  console.log(state); // "AK"
  //  console.log(fetchStateName.get(state))

   //fething the current positions of div, so that tooltip is position underneath the cursor always, no matter the screen size.

   var divNodeEducationCrime = svgEducationAndCrime.node(); // get the DOM node of the selected div
   var rectEducationCrime = divNodeEducationCrime.getBoundingClientRect(); // get the size and position of the div relative to the viewport
   var topEducationCrime = rectEducationCrime.top + window.scrollY; // add the current scroll position to get the top screen coordinate
   var leftEducationCrime = rectEducationCrime.left + window.scrollX; // add the current scroll position to get the left screen coordinate

   var toolTipEducationCrime = d3
   .select("#toolTipEducationCrime")
   .style("top", event.pageY - topEducationCrime + 105+ "px")
   .style("left", event.pageX - leftEducationCrime + 15 + "px");

  toolTipEducationCrime.select('#stateTip').text(fetchStateName.get(state));

   var svgToolTip = toolTipEducationCrime.select("#svgToolTip");
   const svgToolTipWidth = +svgToolTip.attr("width");
   const svgToolTipHeight = +svgToolTip.attr("height");

   // // This is the D3 Margin Convention.
   var margin = { top: 50, right: 20, bottom: 20, left: 50 };
   var innerWidth = svgToolTipWidth - margin.left - margin.right;
   var innerHeight = svgToolTipHeight - margin.top - margin.bottom;

   // append the svg object to the body of the page
   var svg = svgToolTip
     .append("g")
     .attr("transform", `translate(${margin.left},${margin.top})`);

    var crimeRate =fetchCrimeLevelEachState.get(state);
    crimeRate=crimeRate.toFixed(2);
     var educationPercentage = fetchEducationLevelEachState.get(state).toFixed(2);
     const color = d3.scaleOrdinal().range(["red", "#00478f"]);


toolTipEducationCrime.select('#education').text(educationPercentage +" % Graduated From High School");
toolTipEducationCrime.select('#crime').text(crimeRate +" Crimes Commited/100,000 People");

   drawPieChart(
     svg,
     {
       a: crimeRate,
       c: educationPercentage,
     },
     "toolTipEducation",
     innerHeight,
     innerWidth,
     color
   )
}

})


/* Scatter Plot Code */
function drawScatterPlot(svg,dataSelected) {

  var width=d3.select('.visual').style('width');
  var height=d3.select('.visual').style('height');
  width=parseInt(width,10);
  height=parseInt(height,10);

  const selectCluster = svg;

  // This is the D3 Margin Convention.
  margin = { top: 20, right: 30, bottom: 60, left: 100 };
  innerWidth = width - margin.left - margin.right; //this is the width of the barchart
  innerHeight = height - margin.top - margin.bottom; // this is the height of the barchart

  var [clusterPlot, xScale, yScale] = initialiseScatterPlot(
    innerWidth,
    innerHeight,
    selectCluster,
    margin
  );

  updateScatterPlot(
    innerWidth,
    innerHeight,
    dataSelected,
    clusterPlot,
    xScale,
    yScale,
    "Persons graduated from high school (in %)",
    "Crime Levels (per 100,000 people)"
  );

  }
 //initialising plot
 function initialiseScatterPlot(
  innerWidth,
  innerHeight,
  svgDimension,
  margin
) {
  var svg = svgDimension
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  const xScale = d3.scaleLinear().range([0, innerWidth]);
  const yScale = d3.scaleLinear().range([innerHeight, 0]);
  svg.append("g").attr("class", "y-axis");
  svg
    .append("g")
    .attr("class", "x-axis")
    .attr("transform", `translate(0, ${innerHeight})`);

  return [svg, xScale, yScale];
}
//updating the scatterplot
function updateScatterPlot(
  innerWidth,
  innerHeight,
  data,
  svgCluster,
  xScale,
  yScale,
  xAxisLabel,
  yAxisLabel
) {

fetchEducationLevelEachState.forEach((value, key) => {
  if (value === 0) {
    fetchEducationLevelEachState.delete(key);
  }
});

fetchCrimeLevelEachState.forEach((value, key) => {
  if (value === 0) {
    fetchCrimeLevelEachState.delete(key);
  }
});

  var maxEducationValue=d3.extent(fetchEducationLevelEachState.values())
  var maxCrimeValue=d3.extent(fetchCrimeLevelEachState.values());

    var objData=Object.fromEntries(data);
    var values=Object.values(objData);
    // console.log(values)

  svgCluster
    .append("text")
    .attr("text-anchor", "end")
    .attr("x", innerWidth / 1.65 + margin.left)
    .attr("y", innerHeight + margin.top + 25)
    .text(xAxisLabel);

  // Y axis label:
  svgCluster
    .append("text")
    .attr("text-anchor", "end")
    .attr("transform", "rotate(-90)")
    .attr("y", -margin.left + 40)
    .attr("x", -margin.top - innerHeight / 2 + 155)
    .text(yAxisLabel);

  xScale.domain(maxEducationValue);
  yScale.domain(maxCrimeValue);

  svgCluster
    .select(".x-axis")
    .transition()
    .duration(500)
    .call(d3.axisBottom(xScale).ticks(4));

  svgCluster
    .select(".y-axis")
    .transition()
    .duration(500)
    .call(d3.axisLeft(yScale));


var update = svgCluster.select("g").selectAll("circle").data(data);
  update.exit().remove();
   update
   .enter()
    .append("circle")
    .merge(update)
    .attr("id", d=>d[0])
    .attr("cx", (d) => xScale(d[1].education))
    .attr("cy", (d) => yScale(d[1].crime))
    .attr("r", 8)
    .style("fill", "#001122")

  update.exit().remove();

//creating points for scatterplot clustering
  const points = values.map((d) => [d.crime, d.education,0]);

iteration=0
  let k = 2; // number of clusters

  // initialize centroids randomly
  let centroids = Array.from({ length: k }, () => [
    Math.random() * d3.max(points, (d) => d[0]),
    Math.random() * d3.max(points, (d) => d[1]),
  ]);

  // console.log("check")
  // console.log(centroids)
  var clusterButton = d3.select("#clusterButton");
  clusterButton.on("click", function () {
    // console.log("clicked!, now disabling button!");
    clusterButton.on('click',null)
    clusterButton.attr('disabled',true)
    repeatKmeanIterate();

  });



// define a function to repeatedly call kmeanIterate() with an interval of 1 second for 10 seconds/iterations
function repeatKmeanIterate() {
  let i = 0;
  const interval = d3.interval(() => {
    kmeanIterate();
    i++;
    if (i >= 10) {
      interval.stop();
    }
  }, 500);
}


  // update function to calculate k-mean step
  function kmeanIterate() {
iteration++;

    // assigned each point to the nearest centroid
    for (let i = 0; i < points.length; i++) {
      let d = Math.sqrt(
        Math.pow(points[i][0] - centroids[0][0], 2) +
          Math.pow(points[i][1] - centroids[0][1], 2)
      );
      points[i][2] = 0; // nearest

      for (let j = 1; j < k; j++) {
        let dn = Math.sqrt(
          Math.pow(points[i][0] - centroids[j][0], 2) +
            Math.pow(points[i][1] - centroids[j][1], 2)
        );
        if (dn < d) {
          d = dn;
          points[i][2] = j;
        }
      }
    }

    // update centroids
    for (let j = 0; j < k; j++) {
      let dsumX = 0;
      let dsumY = 0;
      let dcount = 0;
      for (let i = 0; i < points.length; i++) {
        if (points[i][2] === j) {
          dsumX += points[i][0];
          dsumY += points[i][1];
          dcount++;
        }
      }
      if (dcount > 0) {
        centroids[j][0] = dsumX / dcount;
        centroids[j][1] = dsumY / dcount;
      }
    }

    // update circle colors
    svgCluster
      .selectAll("circle")
      .data(points)
      .style("fill", (d) => {
        return ["red", "blue"][d[2]];
      });

    document.getElementById(
      "clusterButton"
    ).innerHTML = `Iteration Step (${iteration})`;
  } // end kmeanIterate()
}
}

)



