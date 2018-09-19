function $(id) { return document.getElementById(id); }
window.onload = function(){
  $('search_input').onkeyup = errorCheck;
  $('search_button').onclick = search;
  $('search_output_wrapper').onclick = eraseOutput;
  write();
};
window.onscroll = write;

var count=2;
var lastUnit;

function write() {
  var content = $('content');
  
  while(content.clientHeight - 1000 < (document.documentElement.scrollTop || document.body.scrollTop) + window.innerHeight)
    lastUnit = content.appendChild(visualize(calc(count++)));
}

function calc(mod) {
  var cycle='';
  var length=0;
  var freq = new Array(mod);
  freq.fill(0);
  var a=0; b=1; 
  do {
    cycle+=a+', ';
    length++;
    freq[a] += 1;
    var t = (a+b)%mod;
    a=b;
    b=t;
  } while(a!=0 || b!=1);
  
  var variance = 0;
  for (var i=0; i < mod; i++)
    variance += (freq[i] / length - 1 / mod) * (freq[i] / length - 1 / mod);
  
  return {mod:mod, cycle:cycle, length:length, freq:freq, variance:variance, standard:Math.sqrt(variance)};
}

function visualize(result) {
  var unit = document.createElement('div');
  unit.classList.add('unit');
  var tmp;
  tmp = document.createElement('h2');
  tmp.textContent = result.mod;
  unit.appendChild(tmp);
  
  tmp = document.createElement('h3');
  tmp.textContent = '周期の長さ';
  unit.appendChild(tmp);
  tmp = document.createElement('div');
  tmp.textContent = result.length;
  unit.appendChild(tmp);
  
  tmp = document.createElement('h3');
  tmp.textContent = '周期';
  unit.appendChild(tmp);
  tmp = document.createElement('div');
  tmp.classList.add('cycle');
  tmp.textContent = result.cycle;
  unit.appendChild(tmp);

  tmp = document.createElement('h3');
  tmp.textContent = '元の出現回数:';
  unit.appendChild(tmp);
  tmp = document.createElement('div');
  tmp.classList.add('freq_table');
  var buf = "<table><tr>";
  for(var i=0; i<result.mod; i++)
    buf += "<th>" + i + "</th>"
  buf += "</tr>"
  for(var i=0; i<result.mod; i++)
    buf += "<td>" + result.freq[i] + "</td>"
  buf += "</tr></table>"
  tmp.innerHTML = buf;
  unit.appendChild(tmp);
  
  tmp = document.createElement('h3');
  tmp.textContent = '出現率の分布(未ソート)';
  unit.appendChild(tmp);
  tmp = document.createElement('canvas');
  var lavels = new Array(result.mod);
  for(var i=0; i<result.mod; i++) lavels[i]=""+i;
  var data = new Array(result.mod);
  for(var i=0; i<result.mod; i++) data[i] = result.freq[i] / result.length;
  new Chart(tmp, {
      type: 'bar',
      data: {
        labels: lavels,
        datasets: [{
          label: "",
          backgroundColor: "rgba(14, 100, 200, 1)",
          borderColor: "rgba(14, 100, 200, 1)",
          data: data,
          fill: true,
          lineTension: 0,
        }]
      },
      options: {
         legend: {
            display: false
         },
        responsive: true,
        scales: {
          yAxes: [{
            ticks: {min: 0}
          }]
        }
      }
    });
  unit.appendChild(tmp);

  tmp = document.createElement('h3');
  tmp.textContent = '出現率の分布(ソート済み)';
  unit.appendChild(tmp);
  tmp = document.createElement('canvas');
  var lavels = new Array(result.mod);
  for(var i=0; i<result.mod; i++) lavels[i]=""+i;
  var data = new Array(result.mod);
  for(var i=0; i<result.mod; i++) data[i] = result.freq[i] / result.length;
  lavels.sort(function(a,b){
        if(data[a] > data[b]) return -1;
        if(data[a] < data[b]) return 1;
        return 0;
  });
  data.sort(function(a,b){
        if(a > b) return -1;
        if(a < b) return 1;
        return 0;
  });
  new Chart(tmp, {
      type: 'line',
      data: {
        labels: lavels,
        datasets: [{
          label: "",
          backgroundColor: "rgba(14, 100, 200, 0.2)",
          borderColor: "rgba(14, 100, 200, 1)",
          data: data,
          fill: true,
          lineTension: 0,
        }]
      },
      options: {
         legend: {
            display: false
         },
        responsive: true,
        scales: {
          yAxes: [{
            ticks: {min: 0}
          }]
        }
      }
    });
  unit.appendChild(tmp);
  
  tmp = document.createElement('h3');
  tmp.textContent = '出現率の分散';
  unit.appendChild(tmp);
  tmp = document.createElement('div');
  tmp.textContent = result.variance;
  unit.appendChild(tmp);

  tmp = document.createElement('h3');
  tmp.textContent = '出現率の標準偏差';
  unit.appendChild(tmp);
  tmp = document.createElement('div');
  tmp.textContent = result.standard;
  unit.appendChild(tmp);
  
  return unit;
}

function check(num) {
  return !isNaN(num) && 2 <= num && Math.floor(num) == num;
}
function search() {
  var input = Number($('search_input').value);
  if(!check(input)) return;
  
  $('search_output').appendChild(visualize(calc(input)));
  $('search_output_wrapper').style="display:block;";
}
function errorCheck() {
  var input = $('search_input').value;
  var error = $('search_error');
  if(input !== "" && !check(input)) error.style="display:inline;";
  else error.style="display:none;";
}
function eraseOutput() {
  $('search_output').innerHTML = "";
  $('search_output_wrapper').style="display:none;";
}