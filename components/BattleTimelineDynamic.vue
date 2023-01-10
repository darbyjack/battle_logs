<script setup lang="ts">
const props = defineProps<{
  id: string;
}>();

const tables = ref<any[]>([]);
const rounds = ref<any[]>([]);
const combat = ref(2);
const view_round = ref(1);

onMounted(async () => {
  const response = await fetch("/retrieve", {
    method: "GET",
    headers: {
      BATTLE_LOG_KEY: `${props.id}`,
    },
  });
  const data = await response.json();
  tables.value = data;
  combat.value = tables.value.length - 1;
  if (tables.value.length > 2) {
    let round: any[] = [];
    for (let row in tables.value[combat.value]) {
      if (
        parseInt(row) > 0 &&
        tables.value[combat.value][row]["Round"] !=
          tables.value[combat.value][parseInt(row) - 1]["Round"]
      ) {
        if (round.length > 0) {
          rounds.value.push(round);
          round = [];
        }
      }
      round.push(tables.value[combat.value][row]);
    }
    if (round.length > 0) {
      rounds.value.push(round);
    }
  }
});

function row_icon_color(row: any) {
  const type_map: any = {
    Attack: "red",
    "Officer Ability": "blue",
    "Charging Weapons": "grey",
    "Shield Depleted": "grey",
    "Combatant Destroyed": "black",
  };
  if (type_map[row["Type"]]) {
    return type_map[row["Type"]];
  }
  return "grey";
}

function row_icon(row: any) {
  const type_map: any = {
    Attack: "mdi-sword-cross",
    "Officer Ability": "mdi-account",
    "Charging Weapons": "mdi-battery",
    "Shield Depleted": "mdi-shield-off",
    "Combatant Destroyed": "mdi-account-remove",
  };
  if (type_map[row["Type"]]) {
    return type_map[row["Type"]];
  }
  return "mdi-help";
}
</script>

<template>
  Debug: {{ id }}
  <v-container class="px-6" fluid>
    <v-row v-if="tables.length > 0">
      <v-col cols="12">
        <v-card flat>
          <v-card-title>Battle Timeline</v-card-title>
          <v-card-subtitle v-if="tables.length > 0">
            <v-icon size="large"> mdi-map-marker </v-icon
            >{{ tables[0][0]["Location"] }},
            {{ tables[0][0]["Timestamp"] }}</v-card-subtitle
          >
        </v-card>
      </v-col>
      <v-col cols="6">
        <v-card
          v-if="tables[0].length > 1"
          :class="
            tables[0][0]['Outcome'] == 'DEFEAT'
              ? 'bg-deep-orange'
              : 'bg-light-green'
          "
        >
          <v-card-title
            >{{ tables[0][0]["Player Level"] }}
            {{ tables[0][0]["Player Name"] }}
          </v-card-title>
          <v-card-subtitle
            >{{ tables[0][0]["Ship Level"] }} {{ tables[0][0]["Ship Name"]
            }}<span class="float-right">{{
              parseInt(tables[0][0]["Ship Strength"]).toLocaleString("en-US")
            }}</span></v-card-subtitle
          >
          <div class="pa-6">
            <v-progress-linear
              v-model="tables[0][0]['Shield Health Remaining']"
              :max="tables[0][0]['Shield Health']"
              color="teal"
            ></v-progress-linear
            ><br />
            <v-progress-linear
              v-model="tables[0][0]['Hull Health Remaining']"
              :max="tables[0][0]['Hull Health']"
              color="white"
            ></v-progress-linear>
          </div>
        </v-card>
        <v-card v-else>
          <v-card-title>Armada</v-card-title>
          <v-card-subtitle>Player ships</v-card-subtitle>
        </v-card>
      </v-col>
      <v-col cols="6">
        <v-card
          :class="
            tables[0][tables[0].length - 1]['Outcome'] == 'DEFEAT'
              ? 'bg-deep-orange'
              : 'bg-light-green'
          "
        >
          <v-card-title
            >{{ tables[0][tables[0].length - 1]["Player Level"] }}
            {{ tables[0][tables[0].length - 1]["Player Name"] }}</v-card-title
          >
          <v-card-subtitle
            >{{ tables[0][tables[0].length - 1]["Ship Level"] }}
            {{ tables[0][tables[0].length - 1]["Ship Name"]
            }}<span class="float-right">{{
              parseInt(
                tables[0][tables[0].length - 1]["Ship Strength"]
              ).toLocaleString("en-US")
            }}</span></v-card-subtitle
          >
          <div class="pa-6">
            <v-progress-linear
              v-model="
                tables[0][tables[0].length - 1]['Shield Health Remaining']
              "
              :max="tables[0][tables[0].length - 1]['Shield Health']"
              color="teal"
            ></v-progress-linear
            ><br />
            <v-progress-linear
              v-model="tables[0][tables[0].length - 1]['Hull Health Remaining']"
              :max="tables[0][tables[0].length - 1]['Hull Health']"
              color="white"
            ></v-progress-linear>
          </div>
        </v-card>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" v-if="rounds.length > 0">
        <v-card class="mt-4 mb-4">
          <v-pagination
            v-model="view_round"
            :length="rounds.length"
          ></v-pagination>
          <v-card-title align="center"
            >Round {{ rounds[view_round - 1][0]["Round"] }}</v-card-title
          >

          <v-timeline side="start">
            <v-timeline-item
              v-for="row in rounds[view_round - 1]"
              :key="row['Battle Event']"
              :icon="row_icon(row)"
              :dot-color="row_icon_color(row)"
              fill-dot
            >
              <template v-slot:opposite>
                <v-card min-width="500" v-if="row['Type'] == 'Attack'">
                  <v-card-title>{{ row["Target Name"] }}</v-card-title>
                  <v-card-subtitle>{{ row["Target Ship"] }}</v-card-subtitle>
                  <v-card-text>
                    Mitigates
                    {{
                      parseInt(row["Mitigated Damage"]).toLocaleString("en-US")
                    }}
                    damage ({{
                      (
                        (100.0 / parseFloat(row["Total Damage"])) *
                        parseFloat(row["Mitigated Damage"])
                      ).toFixed(2)
                    }}%)<br />
                    Recieves
                    {{ parseInt(row["Shield Damage"]).toLocaleString("en-US") }}
                    shield health damage<br />
                    Recieves
                    {{ parseInt(row["Hull Damage"]).toLocaleString("en-US") }}
                    hull health damage
                  </v-card-text>
                </v-card>
              </template>
              <v-card min-width="500">
                <v-card-title>{{ row["Attacker Name"] }}</v-card-title>
                <v-card-subtitle>{{ row["Attacker Ship"] }}</v-card-subtitle>

                <v-card-text v-if="row['Type'] === 'Officer Ability'">
                  <b>{{ row["Ability Owner Name"] }}</b> -
                  <span> {{ row["Ability Name"] }}</span>
                </v-card-text>
                <v-card-text v-if="row['Type'] === 'Attack'">
                  <b
                    >Deals
                    {{ parseInt(row["Total Damage"]).toLocaleString("en-US") }}
                    damage</b
                  >
                  <span v-if="row['Critical Hit?'] == 'YES'"> (Critical)</span>
                </v-card-text>
                <v-card-text v-if="row['Type'] === 'Charging Weapons'">
                  <b>Charged weapons to {{ row["Charging Weapons %"] }}%</b>
                </v-card-text>
                <v-card-text v-if="row['Type'] === 'Shield Depleted'">
                  <b>Shield Depleted!</b>
                </v-card-text>
                <v-card-text v-if="row['Type'] === 'Combatant Destroyed'">
                  <b>Destroyed!</b>
                </v-card-text>
              </v-card>
            </v-timeline-item>
          </v-timeline>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
