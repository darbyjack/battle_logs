<template>
    <v-main>
      <v-navigation-drawer permanent>
        <v-list>
          <v-list-item
            prepend-icon="mdi-upload"
            to="/"
            title="Upload Log"
          ></v-list-item>
          <v-list-item
            prepend-icon="mdi-sword-cross"
            to="/battle"
            title="Battle"
          ></v-list-item>
          <v-list-item
            prepend-icon="mdi-list-box"
            to="/summary"
            title="Summary"
          ></v-list-item>
          <v-list-item
            prepend-icon="mdi-raw"
            to="/raw"
            title="Raw Data"
          ></v-list-item>
        </v-list>
  
        <template v-slot:append>
          <div class="pa-2">
            <v-btn block> Logout </v-btn>
          </div>
        </template>
      </v-navigation-drawer>
      <router-view />
    </v-main>
  </template>
  