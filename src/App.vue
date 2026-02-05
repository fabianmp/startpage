<template>
  <Suspense>
    <UApp :toaster="{ expand: true }">
      <Header />
      <UMain>
        <RouterView />
      </UMain>
    </UApp>
  </Suspense>
</template>
