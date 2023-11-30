<!-- <template>
  <div class="content">
    <div class="container-fluid">
      <div class="row">
        <div class="col-12">
        
          <card>
            <template slot="header">
              <h4 class="card-title" @click.native="window.open('html/map1.html')">
                Malaria Cases vs Deaths
              </h4>
            </template>
            <div class="typo-line">
              <img id="image1" src="../assets/img/map1.jpg" alt="Description of image" @click="handleImageClick('image1')">
            </div>
            <div class="typo-line">
              <h4 @click="handleImageClick('image2')">GDP of top 10 Malaria ridden Countries</h4>
              <img id="image2" src="../assets/img/map2.jpg" alt="Description of image" @click="handleImageClick('image2')">
            </div>
          </card>
        </div>

      </div>
    </div>
  </div>
</template>
<script>
  import Card from 'src/components/Cards/Card.vue'


export default {
  components: {
    Card
  },
  methods: {
    handleImageClick(imageId) {
      console.log("Image clicked:", imageId);
      if(imageId === 'image1') {
        // Logic for when the first image is clicked
        window.open('/Users/shreyanshmac/Documents/DSCI 554 Data Viz/assignments/vue dashboard/proj-sankeyou/src/pages/html/map1.html');
      } else if(imageId === 'image2') {
        // Logic for when the second image is clicked
        window.open('html/map2.html');
      }
    }
  }
}


</script>
<style>
#image1 {
  width: 70%;
  height: auto;
}
#image2 {
  width: 70%;
  height: auto;
}
</style> -->
<template>
  <div class="content">
    <div class="container-fluid">
      <div class="row">
        <div class="col-12">
          <card>
            <template slot="header">
              <h4 class="card-title">
                <router-link to="/map1">Top 10 Malaria-Affected Countries: Malaria Cases vs Death</router-link>
              </h4>
            </template>
            <div class="typo-line">
              <img id="image1" src="../assets/img/map1.jpg" alt="Description of image">
            </div>

            <div class="typo-line">
              <h4>
                <router-link to="/map2">Top 10 Malaria-Affected Countries: GDP per Capita</router-link>
              </h4>
              <img id="image2" src="../assets/img/map2.jpg" alt="Description of image">
            </div>
          </card>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import Card from 'src/components/Cards/Card.vue';

  export default {
    components: {
      Card
    }
  };
</script>

<style>
#image1, #image2 {
  width: 70%;
  height: auto;
}
</style>
