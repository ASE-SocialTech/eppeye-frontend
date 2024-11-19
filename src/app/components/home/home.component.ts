import { Component, OnInit } from '@angular/core';
import { Chart, CategoryScale, LinearScale, BarElement, LineElement, Title, Tooltip, Legend, BarController, LineController, PointElement } from 'chart.js';

Chart.register(
  CategoryScale,
  LinearScale,
  BarController,
  LineController,
  BarElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  PointElement
);

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  mockIncidentsData = [
    { timestamp: '2024-11-17T10:00:00Z' }, // 1 incident on Nov 17
    { timestamp: '2024-11-18T11:00:00Z' }, // 3 incidents on Nov 18
    { timestamp: '2024-11-18T14:00:00Z' },
    { timestamp: '2024-11-18T18:00:00Z' },
    { timestamp: '2024-11-19T09:00:00Z' }, // 2 incidents on Nov 19
    { timestamp: '2024-11-19T15:00:00Z' }
  ];

  incidentDataByDay = {
    days: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    incidents: new Array(7).fill(0)
  };

  incidentDataToday = {
    hours: Array.from({ length: 24 }, (_, i) => i), // [0, 1, 2, ..., 23]
    incidents: new Array(24).fill(0)
  };

  ngOnInit(): void {
    this.processMockData();
    this.createBarChart();
    this.createLineChart();
  }

  processMockData(): void {
    const today = new Date('2024-11-19'); // Mock today's date for consistency
    this.mockIncidentsData.forEach((incident) => {
      const incidentDate = new Date(incident.timestamp);

      // Group by day
      const dayIndex = incidentDate.getDay();
      this.incidentDataByDay.incidents[dayIndex]++;

      // Group today's incidents by hour
      if (incidentDate.toDateString() === today.toDateString()) {
        const hourIndex = incidentDate.getHours();
        this.incidentDataToday.incidents[hourIndex]++;
      }
    });

    console.log('Incident Data by Day:', this.incidentDataByDay);
    console.log('Incident Data Today by Hour:', this.incidentDataToday);
  }

  createBarChart(): void {
    const barChartData = {
      labels: this.incidentDataByDay.days,
      datasets: [
        {
          label: 'Incidents per Day',
          data: this.incidentDataByDay.incidents,
          backgroundColor: '#FF6384',
          borderColor: '#FF6384',
          borderWidth: 1
        }
      ]
    };

    new Chart('barChart', {
      type: 'bar',
      data: barChartData,
      options: {
        responsive: true,
        scales: {
          x: {
            title: {
              display: true,
              text: 'Day of the Week'
            }
          },
          y: {
            title: {
              display: true,
              text: 'Number of Incidents'
            },
            beginAtZero: true
          }
        }
      }
    });
  }

  createLineChart(): void {
    const lineChartData = {
      labels: this.incidentDataToday.hours.map(hour => `${hour}:00`),
      datasets: [
        {
          label: 'Today\'s Incidents by Hour',
          data: this.incidentDataToday.incidents,
          borderColor: '#42A5F5',
          backgroundColor: 'rgba(66, 165, 245, 0.2)',
          fill: true
        }
      ]
    };

    new Chart('lineChart', {
      type: 'line',
      data: lineChartData,
      options: {
        responsive: true,
        scales: {
          x: {
            title: {
              display: true,
              text: 'Hour of the Day'
            }
          },
          y: {
            title: {
              display: true,
              text: 'Number of Incidents'
            },
            beginAtZero: true
          }
        }
      }
    });
  }
}
