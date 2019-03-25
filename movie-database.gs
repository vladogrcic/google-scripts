function RunMotherFuckerRun(){
  GetMovie();
  setBackgroundColorOnEvenLines();
}

// ==============================================================================

function GetMovie() {
  var sheet = SpreadsheetApp.getActiveSheet();
  var input_title = sheet.getRange("A2:A").getValues();
  var output_title = [];
  var input_year = sheet.getRange("B2:B").getValues();
  var output_year = [];
  var output_runtime = [];
  var output_genre = [];
  var output_director = [];
  var output_writer = [];
  var output_actors = [];
  var output_country = [];
  var output_plot = [];
  for( var i = 0; i < input_title.length; i++ ){
    var title_name = input_title[i][0];
    var year_name = input_year[i][0];
    if( title_name == "" ){
      var totalRows = sheet.getMaxRows();
        sheet.getRange(totalRows,1, 1,1).setBackground("");
      continue;
    }
    var movie = fetchMovie(title_name, year_name);
    output_runtime.push([movie.runtime]);
    output_genre.push([movie.genre]); 
    output_director.push([movie.director]);
    output_writer.push([movie.writer]);
    output_actors.push([movie.actors]);
    output_country.push([movie.country]);
    output_plot.push([movie.plot]);
    output_year.push([movie.year]);
    if(year_name == ""){
      sheet.getRange(i+2, 2).setValue(movie.year);
    }
  }
  sheet.getRange(2, 3, output_runtime.length, 1).setValues(output_runtime);
  sheet.getRange(2, 4, output_genre.length, 1).setValues(output_genre);
  sheet.getRange(2, 5, output_director.length, 1).setValues(output_director);
  sheet.getRange(2, 6, output_writer.length, 1).setValues(output_writer);
  sheet.getRange(2, 7, output_actors.length, 1).setValues(output_actors);
  sheet.getRange(2, 8, output_country.length, 1).setValues(output_country);
  sheet.getRange(2, 9, output_plot.length, 1).setValues(output_plot);
}

// ==========================================================================================================

function fetchMovie(title_name, year_name){
  var url = 'http://www.omdbapi.com/?t='+title_name+'&y='+year_name+'&plot=full&r=json';
  var results = JSON.parse(UrlFetchApp.fetch(url).getContentText());
  if(results.Error == "Movie not found!" ){
    var result = {
      runtime: "",
      genre: "",
      director: "",
      writer: "",
      actors: "",
      country: "",
      plot: ""
    }
    return result;
    //Logger.log(results);
  }
  var result = {
    runtime: results.Runtime,
    genre: results.Genre.replace(/, /g, '\r\n'),
    director: results.Director.replace(/, /g, '\r\n'),
    writer: results.Writer.replace(/, /g, '\r\n'),
    actors: results.Actors.replace(/, /g, '\r\n'),
    country: results.Country.replace(/, /g, '\r\n'),
    plot: results.Plot.replace(/((?:\S*\s){15}.*?)\s/g, '$1\r\n'),
    year: results.Year
  }
  return result;
}

// ===========================================================================================================

function setBackgroundColorOnEvenLines() {
  var title_name = fetchMovie(title_name);
  //Logger.log(title_name);
  var sheet = SpreadsheetApp.getActiveSheet();
  var totalRows = sheet.getLastRow();
  var totalColumns = sheet.getLastColumn();
  //sheet.getDataRange().setBackground(""); //get cells with data
  sheet.getRange(1, 1, sheet.getMaxRows(), sheet.getMaxColumns()).setBackground("");
  for (var i=2; i <= totalRows; i+=2){
    sheet.getRange(i, 1, 1, totalColumns).setBackground("#F3F3F3");
    sheet.getRange(i, 1, 1, 1).setBackground("lightgray");
  }
  var get_col_num = sheet.getLastColumn();
  // Logger.log (get_col_num);
  for( var j = 1; j <= get_col_num; j++ ){
    sheet.autoResizeColumn(j);
  }
}

// =====================================================================================================================0

function specialOnEdit(e){
  SpreadsheetApp.getActiveSpreadsheet().toast("Jebi se! Počeo je!");
  var col = e.range.getColumn();
  var title_name = fetchMovie(title_name);
  if (col == 1){
    var output_values = [];
    var input_values = e.source.getActiveSheet().getRange(e.range.getRow(), 1, e.range.getNumRows(), 2).getValues();
    for ( var i = 0; i < input_values.length; i++ ){
      //Logger.log("Editing row %s", e.range.getRow() + i); //MG
      var title_name = input_values[i][0];
      var year_name = input_values[i][1];
      if( title_name == "" ){
        var totalRows = e.range.getRow();
        var totalRowsLess = totalRows-1;
       // Logger.log(totalRows);
        var totalColumn = e.range.getLastColumn();
        e.source.getActiveSheet().getRange(totalRows,1, 1,totalColumn).setBackground("");
      continue;
      }
      var movie = fetchMovie(title_name, year_name);
      if(year_name == ""){
        e.source.getActiveSheet().getRange(e.range.getRow(), 2).setValue(movie.year);
      }
      var output_row = [
        movie.runtime,
        movie.genre,
        movie.director,
        movie.writer,
        movie.actors,
        movie.country,
        movie.plot
      ];
      output_values.push(output_row);
    }
    e.source.getActiveSheet().getRange(e.range.getRow(), 3, output_values.length, output_values[0].length).setValues(output_values);
    Logger.log("Test "+output_values);
    sendEmailPDF();
  }
  SpreadsheetApp.getActiveSpreadsheet().toast("Jebi se u kurac! Najebo si!");
}

// // ======================================================================================================

function sendEmailPDF() {
  if(delayedRun(20)){       //Set delay time in seconds.
    setBackgroundColorOnEvenLines();
    //Logger.log("Radi idiot3");
    return;}
}

// // =====================================================================================================

function delayedRun(seconds){
  var cache = CacheService.getDocumentCache();
  var edit_time = new Date().getTime() + seconds*1000;
  var sleep_time = seconds*1000;
  if( cache.get("edit_time") ){
    cache.put("edit_time", edit_time);
    SpreadsheetApp.getActiveSpreadsheet().toast("Changed time to: " + new Date(edit_time), null, 2);
    return;
  }else{
    cache.put("edit_time", edit_time);
  }
  SpreadsheetApp.getActiveSpreadsheet().toast("Start: " + new Date(), null, 2);
  Utilities.sleep(sleep_time);
  while( true ){
    edit_time = parseInt(cache.get("edit_time"));
    sleep_time = edit_time - new Date().getTime()
    if( sleep_time > 1000 ){
      Utilities.sleep(sleep_time);
    }else{
      cache.remove("edit_time");
      break;
    }
  }
  return true;
  SpreadsheetApp.getActiveSpreadsheet().toast("End: " + new Date(), null, 2);
}
