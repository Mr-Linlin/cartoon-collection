const getters = {
  getUserName: (state) => (user) => {
    user = JSON.parse(user)
    return user.username
  },
  getTags: (state) => (userName) => {
    return (state.comm.tabsList =
      userName || sessionStorage.getItem('routerTag'))
  },
}
export default getters
