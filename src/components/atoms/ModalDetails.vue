<template>
  <v-dialog v-model="dialog" max-width="600" v-if="window.inner.width > 600">
    <template v-slot:activator="{ on, attrs }">
      <v-btn color="primary" v-bind="attrs" v-on="on">Open Dialog</v-btn>
    </template>

    <v-card>
      <v-card-title>Modal Title</v-card-title>
      <v-card-text>This is a modal dialog content.</v-card-text>
      <v-card-actions>
        <v-btn color="primary" text @click="dialog = false">Close</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
  <v-bottom-sheet v-model="sheet" v-else>
    <v-card>
      <v-card-title>Bottom Sheet Title</v-card-title>
      <v-card-text>This is a bottom sheet content.</v-card-text>
      <v-card-actions>
        <v-btn color="primary" text @click="sheet = false">Close</v-btn>
      </v-card-actions>
    </v-card>
  </v-bottom-sheet>
</template>

<script>
export default {
  data() {
    return {
      dialog: false
    };
  }
};
</script>
