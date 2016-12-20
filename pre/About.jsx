var React = require('react');
var Helmet = require('react-helmet');
module.exports = React.createClass({
  getInitialState: function(){
    return null;
  },
  componentDidMount: function(){
  },
  render: function(){
    if(chrome.i18n.getUILanguage().indexOf('zh')!=-1){
      return(
        <div id="about">
          <Helmet
            title="About"
          />
          <div className="section" id="top">
			<div className="header">二管家</div>
			<a onClick={CL.bind(null,'https://ainoob.com/project/nooboss','About-link','link')}><img id="icon1" className="spinRight" src="/images/icon_128.png" /></a>
			<a onClick={CL.bind(null,'https://ainoob.com/project/noobox','About-link','link')}><img id="icon2" className="spinLeft" src="/images/icon_2.png" /></a>
		  </div>
               <section className="section">
               <div className="header">二管家能干什么？</div>
               <p>目前，二管家可以 (应用/拓展/主题 在下面都会叫应用)</p>
               <ul>
                      <li>
                             管理你的应用
                             <ul>
                                    <li>开启/关闭/删除一个或多个应用</li>
                             </ul>
                      </li>
                      <li>
                             社区分享
                             <ul>
                                <li>根据当前网页看到二管家社区推荐的适用于当前网页的拓展</li>
                                    <li>每个人都可以给任何一个网站推荐好的拓展</li>
                                    <li>每个人都可以给任何一个拓展打标签</li>
                             </ul>
                      </li>
                      <li>
                             自动应用状态管理
                             <ul>
                                    <li>
                                       根据设置的规则自动启用或禁用应用
                                       <ul>
                                              <li>(减少内存占用)</li>
                                              <li>(只有在需要的时候才开启应用)</li>
                                       </ul>
                                    </li>
                             </ul>
                      </li>
                      <li>
                             应用历史记录
                             <ul>
                                    <li>记录应用的安装，卸载，开启，和关闭</li>
                                    <li>
                                       可以知道版本变化
                                    </li>
                             </ul>
                      </li>
                      <li>
                             显示应用详细信息
                             <ul>
                                    <li>下载crx文件</li>
                                    <li>打开manifest文件</li>
                                    <li>查看权限</li>
                                    <li>和各种各样的详细信息</li>
                             </ul>
                      </li>
               </ul>
               <p>如果你有各种关于二管家使用方面的问题，你可以在这里查看使用介绍: <a onClick={CL.bind(null,'https://ainoob.com/project/nooboss','About-link','link')}>二管家项目</a></p>
            </section>
            <section className="section">
               <div className="header">谁弄的二管家</div>
               <p>二管家是一个<a onClick={CL.bind(null,'https://ainoob.com','About-link','link')}>AInoob</a>写的开源的项目(GPL-V3)。你可以在<a onClick={CL.bind(null,'https://ainoob.com/project/nooboss','About-link','link')}>这里</a>查看二管家的进展</p>
            </section>
            <section className="section">
               <div className="header">隐私？</div>
               <p>二管家是一个傲娇的软件，不会偷取你的隐私信息，也绝对不会在未经过你要求的情况下在二管家界面内出现广告。</p>
               <p>默认情况下，二管家会把你使用二管家的情况和你安装的应用分享到二管家社区，如果你希望支持二管家或者不讨厌二管家，请不要关闭社区功能。</p>
            </section>
            <section className="section">
               <div className="header">怎么支持二管家？</div>
               <p>如果你真的那么喜欢二管家，你可以在选项里开启显示广告（默认关闭），这样二管家界面就会出现广告。这个看个人喜好，二管家给你绝对的权利。不过如果可以，请不要关闭社区功能，不然AInoob就没法知道有没有人在用二管家了，那就很可能停止更新。</p>
            </section>
            <section className="section">
               <div className="header">建议？</div>
               <p>如果你有任何好的建议，请去<a onClick={CL.bind(null,'https://chrome.google.com/webstore/detail/aajodjghehmlpahhboidcpfjcncmcklf/support','About-link','link')}>Chrome网上应用店</a>评论和提建议。</p>
            </section>
          <section className="section">
            <div className="header">分享二管家</div>
            <p>你喜欢二管家吗？如果觉得还不错，那就考虑一下分享二管家吧~</p>
			<a className="shareItem" target="_blank" href="http://www.jiathis.com/send/?webid=tsina&url=https://ainoob.com/project/nooboss&title=NooBoss"><img className="shareIcon" src="thirdParty/sina.png" /></a>
            <a className="shareItem" target="_blank" href="http://www.jiathis.com/send/?webid=weixin&url=https://ainoob.com/project/nooboss&title=NooBoss"><img className="shareIcon" src="thirdParty/wechat.png" /></a>
            <a className="shareItem" target="_blank" href="http://www.jiathis.com/send/?webid=renren&url=https://ainoob.com/project/nooboss&title=NooBoss"><img className="shareIcon" src="thirdParty/renren.png" /></a>
            <a className="shareItem" target="_blank" href="https://www.facebook.com/sharer/sharer.php?u=https%3A//ainoob.com/project/nooboss"><img className="shareIcon" src="thirdParty/facebook.png" /></a>
            <a className="shareItem" target="_blank" href="https://plus.google.com/share?url=https%3A//ainoob.com/project/nooboss"><img className="shareIcon" src="thirdParty/google.png" /></a>
            <a className="shareItem" target="_blank" href="https://www.linkedin.com/shareArticle?mini=true&url=https%3A//ainoob.com/project/nooboss&title=NooBoss%20---%20A%20ultimate%20extension%20for%20Chrome%20extensions%%20managing&summary=&source="><img className="shareIcon" src="thirdParty/linkedin.png" /></a>
            <a className="shareItem" target="_blank" href="https://twitter.com/home?status=https%3A//ainoob.com/project/nooboss"><img className="shareIcon" src="thirdParty/twitter.png" /></a>
          </section>
		  <section className="section">
		    <div className="header">鸣谢</div>
			<ul>
			   <li>二箱使用了Facebook的<a href="https://github.com/facebook/react" target="_blank">React(BSD协议)</a>作为底层建筑</li>
			   <li>二箱使用了JS Foundation的<a href="https://github.com/hustcc/timeago.js" target="_blank">jQuery(MIT协议)</a>来处理一些DOM和Ajax请求</li>
			   <li>二箱使用了Hust.cc的<a href="https://github.com/hustcc/timeago.js" target="_blank">Timeago(MIT协议)</a>来显示时间</li>
			   <li>
				  一些图标来自与<a title="Flaticon" href="http://www.flaticon.com" target="_blank">www.flaticon.com</a>(<a title="Creative Commons BY 3.0" href="http://creativecommons.org/licenses/by/3.0/" target="_blank">CC 3.0 BY</a>)
				  <ul>
					 <li><img src="/thirdParty/options.svg" alt="" width="20" height="20" />来自于作者<a title="Gregor Cresnar" href="http://www.flaticon.com/authors/gregor-cresnar" target="_blank">Gregor Cresnar</a></li>
					 <li><img src="/thirdParty/remove.svg" alt="" width="20" height="20" />来自于作者<a title="Freepik" href="http://www.freepik.com" target="_blank">Freepik</a></li>
					 <li><img src="/thirdParty/add.svg" alt="" width="20" height="20" />来自于作者<a title="Madebyoliver" href="http://www.flaticon.com/authors/madebyoliver" target="_blank">Madebyoliver</a></li>
					 <li><img src="/thirdParty/power-button-on.svg" alt="" width="20" height="20" /><img src="/thirdParty/power-button-off.svg" alt="" width="20" height="20" />来自于作者<a title="Chanut is Industries" href="http://www.flaticon.com/authors/chanut-is-industries" target="_blank">Chanut is Industries</a></li>
					 <li><img src="/thirdParty/view-list.svg" alt="" width="20" height="20" />来自于作者<a href="http://www.freepik.com" title="Freepik" target="_blank">Freepik</a></li>
					 <li><img src="/thirdParty/view-grid.svg" alt="" width="20" height="20" />来自于作者<a href="http://www.flaticon.com/authors/elegant-themes" title="Elegant Themes" target="_blank">Elegant Themes</a></li>
				  </ul>
			   </li>
			</ul>
          </section>
		</div>
      );
    }
    else{
      return(
        <div id="about">
          <Helmet
            title="About"
          />
          <div className="section" id="top">
    <div className="header">NooBoss</div>
    <a onClick={CL.bind(null, 'https://ainoob.com/project/nooboss', 'About-link', 'link')}><img id="icon1" className="spinRight" src="/images/icon_128.png" /></a>
    <a onClick={CL.bind(null, 'https://ainoob.com/project/noobox', 'About-link', 'link')}><img id="icon2" className="spinLeft" src="/images/icon_2.png" /></a>
</div>
<section className="section">
    <div className="header">What can NooBoss do?</div>
    <p>Right now, NooBoss can (apps/extensions/theme will be called apps down below)</p>
    <ul>
        <li>
            Manage your apps
            <ul>
                <li>enable/disable/remove one or a bunch of apps</li>
            </ul>
        </li>
        <li>
            NooBoss community
            <ul>
                <li>get apps recommended by NooBoss community for the website you are visiting</li>
                <li>you can recommend useful apps to NooBoss community</li>
                <li>you can tag useful or spammy apps</li>
            </ul>
        </li>
        <li>
            Auto state management
            <ul>
                <li>
                    automatically enable/disable apps base on auto state rules
                    <ul>
                        <li>(you can save memory)</li>
                        <li>(enable apps only when you need them)</li>
                    </ul>
                </li>
            </ul>
        </li>
        <li>
            Show history of&nbsp;apps
            <ul>
                <li>installation, removal, enabling, disabling</li>
                <li>
                    show the version change
                    <ul>
                        <li>(you can tell when did apps got updated)</li>
                    </ul>
                </li>
            </ul>
        </li>
        <li>
            Show detailed information of&nbsp;apps
            <ul>
                <li>download crx file</li>
                <li>open manifest file</li>
                <li>see permissions</li>
                <li>And a lot more informations</li>
            </ul>
        </li>
    </ul>
    <p>If you have questions about how to use NooBoss, you can find instructions here: <a onClick={CL.bind(null, 'https://ainoob.com/project/nooboss', 'About-link', 'link')}>NooBoss project</a></p>
</section>
<section className="section">
    <div className="header">Who made NooBoss</div>
    <p>NooBoss is an open source project under GPL-V3 made by <a onClick={CL.bind(null, 'https://ainoob.com', 'About-link', 'link')}>AInoob</a>, you can check the project progress <a onClick={CL.bind(null, 'https://ainoob.com/project/nooboss', 'About-link', 'link')}>here</a></p>
</section>
<section className="section">
    <div className="header">Privacy</div>
    <p>NooBoss is a software with proud, it will never steal your private information, and it will never show ADs unless you told NooBoss to do so.</p>
    <p>By default, NooBoss will share you usage of NooBoss and Apps you installed on Chrome to NooBoss community, please leave this on if you want to support NooBoss or you want AInoob to keep developing NooBoss. Your personal information will not be shared.</p>
</section>
<section className="section">
    <div className="header">How to support NooBoss?</div>
    <p>If you love NooBoss, you can choose to show ADs(it's off by default), so I will be more motivated to maintain and upgrade NooBoss. If you turn this on, NooBoss will show ADs only when you open NooBoss, and will only show ADs within NooBoss. Feel free to turn it on or off, as long as you turned on the joinCommunity, AInoob will know that sommeone else, not just him, is using NooBoss, and that feels good man/woman.</p>
</section>
<section className="section">
    <div className="header">Any suggestions?</div>
    <p>If you have any suggestions about NooBoss, plese comment on support page in <a onClick={CL.bind(null, 'https://chrome.google.com/webstore/detail/aajodjghehmlpahhboidcpfjcncmcklf/support', 'About-link', 'link')}>Chrome web store</a>.</p>
</section>
<section className="section">
    <div className="header">Share NooBoss</div>
    <p>Do you like NooBoss? If so, please consider sharing NooBoss!</p>
    <a className="shareItem" target="_blank" href="https://www.facebook.com/sharer/sharer.php?u=https%3A//ainoob.com/project/nooboss"><img className="shareIcon" src="thirdParty/facebook.png" /></a>
    <a className="shareItem" target="_blank" href="https://plus.google.com/share?url=https%3A//ainoob.com/project/nooboss"><img className="shareIcon" src="thirdParty/google.png" /></a>
    <a className="shareItem" target="_blank" href="https://www.linkedin.com/shareArticle?mini=true&url=https%3A//ainoob.com/project/nooboss&title=NooBoss%20---%20A%20ultimate%20extension%20for%20Chrome%20extensions%%20managing&summary=&source="><img className="shareIcon" src="thirdParty/linkedin.png" /></a>
    <a className="shareItem" target="_blank" href="https://twitter.com/home?status=https%3A//ainoob.com/project/nooboss"><img className="shareIcon" src="thirdParty/twitter.png" /></a>
    <a className="shareItem" target="_blank" href="http://www.jiathis.com/send/?webid=tsina&url=https://ainoob.com/project/nooboss&title=NooBoss"><img className="shareIcon" src="thirdParty/sina.png" /></a>
    <a className="shareItem" target="_blank" href="http://www.jiathis.com/send/?webid=weixin&url=https://ainoob.com/project/nooboss&title=NooBoss"><img className="shareIcon" src="thirdParty/wechat.png" /></a>
    <a className="shareItem" target="_blank" href="http://www.jiathis.com/send/?webid=renren&url=https://ainoob.com/project/nooboss&title=NooBoss"><img className="shareIcon" src="thirdParty/renren.png" /></a>
</section>
<section className="section">
    <div className="header">Acknowledgements</div>
    <ul>
        <li>NooBoss uses <a href="https://github.com/facebook/react" target="_blank">React(BSD Liscense)</a> from Facebook to build the bases</li>
        <li>NooBoss uses <a href="https://github.com/hustcc/timeago.js" target="_blank">jQuery(MIT Liscense)</a> from JS Foundation to handle DOM and Ajax requests</li>
        <li>NooBoss uses <a href="https://github.com/hustcc/timeago.js" target="_blank">Timeago(MIT Liscense)</a> from Hust.cc to display timeago</li>
        <li>
            Some icons are from<a title="Flaticon" href="http://www.flaticon.com" target="_blank">www.flaticon.com</a>(<a title="Creative Commons BY 3.0" href="http://creativecommons.org/licenses/by/3.0/" target="_blank">CC 3.0 BY</a>)
            <ul>
                <li><img src="/thirdParty/options.svg" alt="" width="20" height="20" />is made by <a title="Gregor Cresnar" href="http://www.flaticon.com/authors/gregor-cresnar" target="_blank">Gregor Cresnar</a></li>
                <li><img src="/thirdParty/remove.svg" alt="" width="20" height="20" />is made by <a title="Freepik" href="http://www.freepik.com" target="_blank">Freepik</a></li>
                <li><img src="/thirdParty/add.svg" alt="" width="20" height="20" />is made by <a title="Madebyoliver" href="http://www.flaticon.com/authors/madebyoliver" target="_blank">Madebyoliver</a></li>
                <li><img src="/thirdParty/power-button-on.svg" alt="" width="20" height="20" /><img src="/thirdParty/power-button-off.svg" alt="" width="20" height="20" />is made by <a title="Chanut is Industries" href="http://www.flaticon.com/authors/chanut-is-industries" target="_blank">Chanut is Industries</a></li>
				<li><img src="/thirdParty/view-list.svg" alt="" width="20" height="20" />is made by <a href="http://www.freepik.com" title="Freepik" target="_blank">Freepik</a></li>
				<li><img src="/thirdParty/view-grid.svg" alt="" width="20" height="20" />is made by <a href="http://www.flaticon.com/authors/elegant-themes" title="Elegant Themes" target="_blank">Elegant Themes</a></li>
            </ul>
        </li>
    </ul>
</section>
        </div>
      );
    }
    
  }
});
