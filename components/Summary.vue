<script>
import BattleLog from "~~/assets/BattleLogs";
import { Pie, Line } from "vue-chartjs";
import {
  Chart as ChartJS,
  ArcElement,
  BarElement,
  CategoryScale,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
} from "chart.js";

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale
);
ChartJS.register(ArcElement, Tooltip, Legend, PointElement, LineElement);

const background_colors = [
  "#FF8A80",
  "#E040FB",
  "#FF6E40",
  "#448AFF",
  "#18FFFF",
  "#69F0AE",
  "#EEFF41",
  "#FFAB40",
];

export default {
  data: () => ({
    location: "",
    timestamp: "",
    view_round: 1,
    total_damage: {},
    unmitigated_damage: {},
    hull_damage: {},
    damage_per_round: {},
    summary: {
      headers: [],
      rows: [],
    },
    chartOptions: {
      responsive: true,
    },
  }),
  beforeMount() {
    let list_values = (value_name, names, lists) => {
        let values = [];
        for(let name of names) {
            values.push(lists[name][value_name])
        }
        return values;
    };
    if (localStorage.current) {
      let battle_log = new BattleLog(
        JSON.parse(localStorage.getItem(localStorage.current))
      );
      this.location = battle_log.location;
      this.timestamp = battle_log.timestamp;
      if (battle_log.tables.length > 1) {
        let stats = battle_log.get_stats();
        this.damage_per_round.labels = Array.from(
          { length: stats.rounds },
          (_, i) => i
        );
        this.damage_per_round.datasets = [];
        for (let attacker in stats.attackers) {
          this.damage_per_round.datasets.push({
            label: stats.attackers[attacker],
            borderColor: background_colors[attacker],
            data: stats.per_round.map((item) =>
              item[stats.attackers[attacker]]
                ? item[stats.attackers[attacker]].total
                : 0
            ),
            cubicInterpolationMode: "monotone",
          });
        }
        // this.summary.headers = stats.attackers;
        this.summary = battle_log.get_summary_table();
        this.total_damage["labels"] = stats.attackers;
        this.unmitigated_damage["labels"] = stats.attackers;
        this.hull_damage["labels"] = stats.attackers;
        this.total_damage["datasets"] = [
          {
            data: list_values("total", stats.attackers, stats.per_person),
            backgroundColor: background_colors,
          },
        ];
        this.unmitigated_damage["datasets"] = [
          {
            data: list_values("unmitigated", stats.attackers, stats.per_person), 
            backgroundColor: background_colors,
          },
        ];
        this.hull_damage["datasets"] = [
          {
            data: list_values("hull", stats.attackers, stats.per_person),
            backgroundColor: background_colors,
          },
        ];
      }
    }
  },
  methods: {},
  components: { Pie, Line },
};
</script>



<template>
    <v-container class="px-6" fluid>
      <v-row v-if="location.length > 0">
        <v-col cols="12">
          <v-card flat>
            <v-card-title>Battle Summary</v-card-title>
            <v-card-subtitle>
              <v-icon size="large"> mdi-map-marker </v-icon>{{ location }},
              {{ timestamp }}
            </v-card-subtitle>
          </v-card>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="4">
          <v-card flat>
            <v-card-title>Total Damage</v-card-title>
            <Pie
              id="total_damage_chart"
              :options="chartOptions"
              :data="total_damage"
            />
          </v-card>
        </v-col>
        <v-col cols="4">
          <v-card flat>
            <v-card-title>Unmitigated Damage</v-card-title>
            <Pie
              id="my-chart-id"
              :options="chartOptions"
              :data="unmitigated_damage"
            />
          </v-card>
        </v-col>
        <v-col cols="4">
          <v-card flat>
            <v-card-title>Hull Damage</v-card-title>
            <Pie id="my-chart-id" :options="chartOptions" :data="hull_damage" />
          </v-card>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12">
          <v-card>
            <v-card-title>Damage Done</v-card-title>
            <v-table>
              <thead>
                <tr>
                  <th></th>
                  <th
                    v-for="header in summary.headers"
                    :key="header"
                    class="text-left"
                  >
                    {{ header }}
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="item in summary.rows"
                  :key="Object.values(item).join('-')"
                >
                  <td>
                    <strong>{{ item[0] }}</strong>
                  </td>
                  <td v-for="value in item.slice(1)" :key="value">
                    {{ value }}
                  </td>
                </tr>
              </tbody>
            </v-table>
          </v-card>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12">
          <v-card>
            <v-card-title>Damage Received</v-card-title>
            <v-table>
              <thead>
                <tr>
                  <th></th>
                  <th
                    v-for="header in summary.headers"
                    :key="header"
                    class="text-left"
                  >
                    {{ header }}
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="item in summary.rows_received"
                  :key="Object.values(item).join('-')"
                >
                  <td>
                    <strong>{{ item[0] }}</strong>
                  </td>
                  <td v-for="value in item.slice(1)" :key="value">
                    {{ value }}
                  </td>
                </tr>
              </tbody>
            </v-table>
          </v-card>
        </v-col>
      </v-row>
  
      <v-row>
        <v-col>
          <v-card flat>
            <v-card-title>Damage per Round</v-card-title>
            <Line :data="damage_per_round" :options="chartOptions" />
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </template>
  