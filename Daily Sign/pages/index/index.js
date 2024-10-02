const config = require('../../config');

// pages/index/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    inputValue: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  },

  handleInput(e) {
    this.setData({
      inputValue: e.detail.value
    });
  },

  onTopicTap(e) {
    const { value } = e.currentTarget.dataset;
    this.setData({ inputValue: value }, () => {
      // 在设置完 inputValue 后立即调用 goToResult
      this.goToResult();
    });
  },

  onConfirm() {
    if (this.data.inputValue.trim()) {
      this.goToResult();
    } else {
      wx.showToast({
        title: '请输入内容',
        icon: 'none'
      });
    }
  },

  goToResult() {
    wx.showLoading({
      title: '求签中...',
    });
    wx.request({
      url: 'https://api.t1qq.com/api/tool/cq',
      method: 'GET',
      data: {
        key: config.getT1qqKey()
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded;charset:utf-8;'
      },
      success: (res) => {
        wx.hideLoading();
        console.log('API response:', res.data);
        if (res.data && res.data.code === 200) {
          // 处理 title
          let processedTitle = res.data.title || '';
          const titleMatch = processedTitle.match(/（(.+)）/);
          if (titleMatch && titleMatch[1]) {
            processedTitle = titleMatch[1];
          }

          // 处理 qian
          let processedQian = res.data.qian || '';
          const qianMatch = processedQian.match(/签诗：(.+)/);
          if (qianMatch && qianMatch[1]) {
            processedQian = qianMatch[1].trim();
          }

          // 更新处理后的数据
          const processedData = {
            ...res.data,
            title: processedTitle,
            qian: processedQian
          };

          const resultData = JSON.stringify(processedData);
          wx.navigateTo({
            url: `/pages/result/result?data=${encodeURIComponent(resultData)}&question=${encodeURIComponent(this.data.inputValue)}`,
          });
        } else {
          wx.showToast({
            title: '求签失败，请重试',
            icon: 'none'
          });
        }
      },
      fail: (error) => {
        console.error('Request failed:', error);
        wx.hideLoading();
        wx.showToast({
          title: '网络错误，请重试',
          icon: 'none'
        });
      }
    });
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  },

  goToResult() {
    wx.showLoading({
      title: '求签中...',
    });
    wx.request({
      url: 'https://api.t1qq.com/api/tool/cq',
      method: 'GET',
      data: {
        key: config.getT1qqKey()
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded;charset:utf-8;'
      },
      success: (res) => {
        wx.hideLoading();
        console.log('API response:', res.data);
        if (res.data && res.data.code === 200) {
          // 处理 title
          let processedTitle = res.data.title || '';
          const titleMatch = processedTitle.match(/（(.+)）/);
          if (titleMatch && titleMatch[1]) {
            processedTitle = titleMatch[1];
          }

          // 处理 qian
          let processedQian = res.data.qian || '';
          const qianMatch = processedQian.match(/签诗：(.+)/);
          if (qianMatch && qianMatch[1]) {
            processedQian = qianMatch[1].trim();
          }

          // 更新处理后的数据
          const processedData = {
            ...res.data,
            title: processedTitle,
            qian: processedQian
          };

          const resultData = JSON.stringify(processedData);
          wx.navigateTo({
            url: `/pages/result/result?data=${encodeURIComponent(resultData)}&question=${encodeURIComponent(this.data.inputValue)}`,
          });
        } else {
          wx.showToast({
            title: '求签失败，请重试',
            icon: 'none'
          });
        }
      },
      fail: (error) => {
        console.error('Request failed:', error);
        wx.hideLoading();
        wx.showToast({
          title: '网络错误，请重试',
          icon: 'none'
        });
      }
    });
  }
})