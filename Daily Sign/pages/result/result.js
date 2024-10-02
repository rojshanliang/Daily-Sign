// pages/result/result.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    title: '',
    qian: '',
    jie: '',
    time: '',
    messages: [],
    inputMessage: '',
    scrollToMessage: '',
    inputValue: '',
    isAITyping: false,
    typingDots: '.',
    userQuestion: '' // 新增这一行
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log('Received options:', options);
    if (options.data) {
      try {
        const data = JSON.parse(decodeURIComponent(options.data));
        console.log('Parsed data:', data);
        if (data && data.code === 200) {
          this.setData({
            title: data.title || '',
            qian: data.qian || '',
            jie: data.jie || '',
            time: data.time || '',
            userQuestion: decodeURIComponent(options.question || '') // 新增这一行
          })
        } else {
          throw new Error('Invalid data structure');
        }
      } catch (error) {
        console.error('Error parsing data:', error);
        wx.showToast({
          title: '数据加载失败',
          icon: 'none'
        })
      }
    } else {
      console.error('No data received');
      wx.showToast({
        title: '数据加载失败',
        icon: 'none'
      })
    }

    // 只添加初始问候息
    this.addAIMessage("有缘人，想问我点什么？");

    // 设置页面标题
    wx.setNavigationBarTitle({
      title: '灵签解读'
    });
  },

  addAIMessage(content) {
    const aiMessage = {
      type: 'ai',
      content: content
    };
    const newMessages = [...this.data.messages, aiMessage];
    this.setData({
      messages: newMessages,
      scrollToMessage: `msg-${newMessages.length - 1}`
    });
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

  onInputChange(e) {
    this.setData({
      inputValue: e.detail.value
    });
  },

  sendMessage() {
    if (!this.data.inputValue.trim()) {
      return; // 如果输入为空，不发送消息
    }

    const userMessage = {
      type: 'user',
      content: this.data.inputValue
    };

    const newMessages = [...this.data.messages, userMessage];

    this.setData({
      messages: newMessages,
      inputValue: '',
      scrollToMessage: `msg-${newMessages.length - 1}`,
      isAITyping: true
    });

    // 开始显示输入动画
    this.startTypingAnimation();

    // 调用 AI 响应函数
    this.getAIResponse(newMessages);
  },

  startTypingAnimation() {
    this.typingAnimationTimer = setInterval(() => {
      let dots = this.data.typingDots;
      dots = dots.length >= 3 ? '.' : dots + '.';
      this.setData({ typingDots: dots });
    }, 500);
  },

  stopTypingAnimation() {
    clearInterval(this.typingAnimationTimer);
    this.setData({
      isAITyping: false,
      typingDots: '.'
    });
  },

  getAIResponse(messages) {
    const config = require('../../config');
    const { title, qian, jie, userQuestion } = this.data;
    const formattedMessages = [
      {
        role: "system",
        content: `##角色:你是一个有关占卜和解签的智能助手，非常善于针对算命专业领域以及与签诗、解签回答问题，你的目标受众是针对抽签和算命感兴趣的用户，对话风格上具有一定的玄学话语且语气幽默，在与用户对话时通过回应不断的吸引用户进行询问；
        ##任务:请结合 用户的原始问题是："${userQuestion} 以及标题：${title}、签文：${qian}、解释：${jie}来回答用户相关问题。"
        ##规则:1.着重围绕是用户原始问题去回答2.当判断用户询问非签诗及解签相关问题时,询问用户该问题是否与解读签相关,如果不相关引导用户回到签解读;3.如果用户多次询问与签不相关问题则友善的回复用户『对不起，我没办法回复与签儿无关的问题。』`
      },
      ...messages.map(msg => ({
        role: msg.type === 'user' ? 'user' : 'assistant',
        content: msg.content
      }))
    ];

    wx.request({
      url: 'https://ark.cn-beijing.volces.com/api/v3/chat/completions',
      method: 'POST',
      header: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + config.getArkKey()
      },
      data: {
        model: config.getArkModel(),
        messages: formattedMessages,
        stream: false,
        max_tokens: 1000
      },
      success: (res) => {
        if (res.data && res.data.choices && res.data.choices.length > 0) {
          const aiResponse = res.data.choices[0].message.content;
          const newMessages = [...this.data.messages, { type: 'ai', content: aiResponse }];
          this.setData({
            messages: newMessages,
            scrollToMessage: `msg-${newMessages.length - 1}`
          });
          this.stopTypingAnimation();
        }
      },
      fail: (error) => {
        console.error('API request failed:', error);
        this.stopTypingAnimation();
        // 可以在这里添加错误处理逻辑
      }
    });
  }
})