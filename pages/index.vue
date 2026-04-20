<template>
  <div class="main-page">
<!--    <PreviewCards class="preview-cards"/>-->
<!--    <PopularProducts class="popular-products"/>-->
<!--    <AlarmSelection class="alarm-selection"/>-->
    <PopularCatalogs class="popular-catalogs"/>
<!--    <InstallAlarm class="install-alarm"/>-->
    <FeedbackFromMaps class="feedback-from-map"/>
<!--    <CallUs class="call-us"/>-->
  </div>
</template>

<style scoped>
.main-page {
  padding: 0 70px;
}
.preview-cards{
  margin-top: 47px;
}
.popular-products{
  margin-top: 51px;
}
.alarm-selection{
  margin-top: 82px;
}
.popular-catalogs{
  margin-top: 78px;
}
.install-alarm{
  margin-top: 92px;
}
.feedback-from-map{
  margin-top: 92px;
}
.call-us{
  margin-top: 82px;
  margin-bottom: 64px;
}
@media (max-width: 1100px) {
  .main-page {
    padding: 0 37px;
  }
  .preview-cards{
    margin-top: 28px;
  }
  .popular-products{
    margin-top: 48px;
  }
  .alarm-selection{
    margin-top: 48px;
  }
  .popular-catalogs{
    margin-top: 89px;
  }
  .install-alarm{
    margin-top: 54px;
  }
  .feedback-from-map{
    margin-top: 82px;
  }
  .call-us{
    margin-bottom: 60px;
  }
}
@media (max-width: 744px) {
  .main-page {
    padding: 0 20px;
  }
  .preview-cards{
    margin-top: 28px;
  }
  .popular-products{
    margin-top: 65px;
  }
  .popular-catalogs{
    margin-top: 63px;
  }
  .install-alarm{
    margin-top: 67px;
  }
  .feedback-from-map{
    margin-top: 67px;
  }
  .call-us{
    margin-top: 41px;
    margin-bottom: 53px;
  }
}
</style>
<script setup lang="ts">
</script>