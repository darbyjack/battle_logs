<script setup>
import BattleLog from '~~/assets/BattleLogs'

let tables = ref([]);
let items = ref([]);

const router = useRouter();

onMounted(() => {
    for(let key of Object.keys(localStorage)) {
        if(key !== "current") {
          items.value.push({
            "title": key,
            "value": key
          });
        }
      }
});

function parse_log(e) {
    let file = e.target.files[0];
      console.log(file);
      let csv_data = new BattleLog();
      csv_data.from_file(file).then((battle_log) => {
          localStorage.setItem(file.name, JSON.stringify(battle_log.tables));
          localStorage.setItem("current", file.name);
          router.push({ "path": "/battle"});
      });   
}

function select_log(e) {
      console.log(e);
      localStorage.current = e.id;
      router.push({ "path": "/battle"});
}
</script>


<template>
  <v-container class="px-6" fluid>
    <v-row>
      <v-col>
        <v-card flat>
          <v-card-title>Upload Battle Log</v-card-title>
          <v-card-subtitle
            >Upload an explorted battle log csv file</v-card-subtitle
          >
        </v-card>
      </v-col>
      <v-col cols="12">
        <v-card flat>
          <v-form>
            <v-file-input
              accept=".csv,.tsv"
              label="CSV File"
              variant="solo"
              @change="parse_log"
            ></v-file-input>
          </v-form>
        </v-card>
        <v-card>
          <v-list :items="items" @click:select="select_log"></v-list>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>