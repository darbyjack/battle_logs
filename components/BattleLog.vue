<script>
export default {
  data: () => ({
    tables: [],
  }),
  mounted() {
      if (localStorage.current) {
          this.tables = JSON.parse(localStorage.getItem(localStorage.current));
      }
  },
};
</script>


<template>
    <v-container class="px-6" fluid>
      <v-row>
          <v-col>
          <v-card flat>
              <v-card-title>Raw Data</v-card-title>
              <v-card-subtitle>Displayed as read from exported log</v-card-subtitle>
          </v-card>
          </v-col>
        <v-col v-for="table in tables" :key="Object.keys(table[0]).join('-')" cols="12">
          <v-card>
            <v-table>
              <thead>
                <tr>
                  <th
                    v-for="header in Object.keys(table[0])"
                    :key="header"
                    class="text-left"
                  >
                    {{ header }}
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="item in table"
                  :key="Object.values(item).join('-')"
                >
                  <td v-for="value in Object.values(item)" :key="value">
                    {{ value }}
                  </td>
                </tr>
              </tbody>
            </v-table>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </template>
  