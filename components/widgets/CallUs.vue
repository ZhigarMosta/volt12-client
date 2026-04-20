<template>
  <ActionBackground class="action-background">
    <div class="side">
      <div class="left-side">
        <ActionTitle class="call-us-action-title">позвони нам сейчас</ActionTitle>
        <p class="call-us-description">не теряй выгоду!</p>
      </div>
      <div class="left-right">
        <p class="call-us-phone">+7 (351) 77-66-224</p>
        <p class="call-us-email">mastervolt12@yandex.ru</p>
      </div>
    </div>
  </ActionBackground>
</template>

<style scoped>
.action-background {
  height: 178px;
}

.call-us-description {
  font-family: 'NT Somic', sans-serif;
  font-weight: bold;
  font-size: 20px;
  color: var(--white);
}

.call-us-phone {
  font-family: 'NT Somic', sans-serif;
  font-weight: bold;
  font-size: 30px;
  color: var(--white);
  margin-right: 14px;
}

.call-us-email {
  font-family: 'NT Somic', sans-serif;
  font-weight: bold;
  font-size: 20px;
  color: var(--white);
  text-align: right;
}

.side {
  width: 100%;
  padding: 0 63px 0 55px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

@media (max-width: 1100px) {
  .side {
    width: 100%;
    padding: 0 30px 0 47px;
    display: flex;
    justify-content: space-between;
  }
  .call-us-action-title{
    font-size: 20px;
  }
  .action-background {
    height: 134px;
  }
}
@media (max-width: 744px) {
  .side{
    flex-direction: column;
    align-items: unset;
    gap: 10px;
    padding: 31px 48px 27px 48px;
  }
  .call-us-email{
    text-align: unset;
  }
  .action-background {
    height: 100%;
  }
}
</style>