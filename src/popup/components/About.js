import React, { Component } from 'react';
import styled from 'styled-components';
import { sendMessage } from '../../utils';

const AboutDiv = styled.div`
	font-size: ${props => props.em}em;
	a{
		color: ${() => shared.themeMainColor}
	}
	section{
		position: relative;
		overflow: hidden;
	}
	#listOfNooBoss{
		margin-left: -28px !important;
	}
	#icon1, #icon2{
		position: absolute;
		top: 17px;
		left: 200px;
		width: 20px;
		height: 20px;
		img{
			width: 100%;
			height: 100%;
		}
	}
	#icon2{
		left: 300px;
	}
	ol{
		ol{
			list-style-type: lower-alpha;
		}
	}
	.shareItem{
		float: left;
		margin-right: 12px;
		display: block;
		width: 66px;
		height: 66px;
		img{
			width: 100%;
			height: 100%;
		}
	}
`;

class About extends Component{
	constructor(props) {
		super(props);
		this.state = {
			language: 'en'
		};
	}
	cl(category, action, label) {
		sendMessage({
			job: 'bello',
			bananana: {
				category,
				action,
				label
			}
		});
	}
	render() {
		let aboutDiv = (
			<AboutDiv>
				<section>
					<h2>NooBoss</h2>
					<a id="icon1" target="_blank" href='https://ainoob.com/project/nooboss'
						onClick={this.cl.bind(null, 'about', 'clickAInoobLink', 'NooBoss')}>
						<img className="spinRight" src="/images/icon_128.png" />
					</a>
					<a id="icon2" target="_blank" href='https://ainoob.com/project/noobox'
						onClick={this.cl.bind(null, 'about', 'clickAInoobLink', 'NooBox')}>
						<img className="spinRight" src="/images/icon2_128.png" />
					</a>
					<p>What, Why, Who</p>
					<p>In short, AInoob made NooBoss, an extension that manages extensions, only to empower/faciliate/help those who needs it, like myself.</p>
					<p>Please share NooBoss if you like it or if you want it to be better.</p>
					<p>Share -> More users -> AInoob dedicate more time on improving NooBoss.</p>
				</section>
				<section>
					<h5>A list about NooBoss</h5>
					<ol id="listOfNooBoss">
						<li>NooBoss is open source software and charge free.
							<ol>
								<li>NooBoss is under liscense <a target="_blank" href="https://www.gnu.org/licenses/gpl-3.0.en.html">GPL-V3</a></li>
								<li>It's not you don't pay any money, but that there is no way to pay a penny.</li>
							</ol>
						</li>
						<li>I do not make any money by making NooBoss.
						</li>
						<li>I use Google Analytics to see how many people are using NooBoss, thus giving me a good motive to work on NooBoss.
							<ol>
								<li>NooBoss sends your usage of NooBoss and NooBoss only.</li>
								<li>If you want, you can turn off joinCommunity feature, but please, please keep it on so I know people are using NooBoss.</li>
								<li>NooBoss do not send any of your personal information to AInoob, why would I need them if I am not making money, right?</li>
							</ol>
						</li>
						<li>I do not accept any donation or service fee.
						</li>
						<li>If there is a bug, I usually fixed it relatively fast.
							<ol>
								<li>As far as I can tell, all lethal bugs were fixed within a week.</li>
								<li>For a feature request, it depends on a lot of factors to tell how fast will the feature be delivered.</li>
							</ol>
						</li>
						<li>Joinning community is what make NooBoss even more special, please do not leave.
							<ol>
								<li>You will be able to see ratings and tags about extensions you are using.</li>
								<li>You can get extensions recommendation.</li>
								<li>AInoob will know someone is using NooBoss, and he will be happy about it.</li>
							</ol>
						</li>
					</ol>
				</section>
				<section>
					<h5>Share NooBoss</h5>
					<p>Do you like NooBoss? If so, please consider sharing NooBoss!</p>
					<a className="shareItem" target="_blank" href="https://www.facebook.com/sharer/sharer.php?u=https%3A//ainoob.com/project/nooboss"><img className="shareIcon" src="thirdParty/facebook.png" /></a>
					<a className="shareItem" target="_blank" href="https://plus.google.com/share?url=https%3A//ainoob.com/project/nooboss"><img className="shareIcon" src="thirdParty/google.png" /></a>
					<a className="shareItem" target="_blank" href="https://www.linkedin.com/shareArticle?mini=true&url=https%3A//ainoob.com/project/nooboss&title=NooBoss%20---%20A%20ultimate%20extension%20for%20Chrome%20extensions%%20managing&summary=&source="><img className="shareIcon" src="thirdParty/linkedin.png" /></a>
					<a className="shareItem" target="_blank" href="https://twitter.com/home?status=https%3A//ainoob.com/project/nooboss"><img className="shareIcon" src="thirdParty/twitter.png" /></a>
					<a className="shareItem" target="_blank" href="http://www.jiathis.com/send/?webid=tsina&url=https://ainoob.com/project/nooboss&title=NooBoss"><img className="shareIcon" src="thirdParty/sina.png" /></a>
					<a className="shareItem" target="_blank" href="http://www.jiathis.com/send/?webid=weixin&url=https://ainoob.com/project/nooboss&title=NooBoss"><img className="shareIcon" src="thirdParty/wechat.png" /></a>
					<a className="shareItem" target="_blank" href="http://www.jiathis.com/send/?webid=renren&url=https://ainoob.com/project/nooboss&title=NooBoss"><img className="shareIcon" src="thirdParty/renren.png" /></a>
				</section>
				<section>
					<h5>What can NooBoss do?</h5>
					<p>Right now, NooBoss can (apps/extensions/theme will be called extensions down below)</p>
					<ul>
						<li>
							Manage your extensions
            <ul>
								<li>enable/disable/remove one or a bunch of extensions</li>
							</ul>
						</li>
						<li>
							NooBoss community
            <ul>
								<li>get extensions recommended by NooBoss community for the website you are visiting</li>
								<li>you can recommend useful extensions to NooBoss community</li>
								<li>you can tag useful or spammy extensions</li>
							</ul>
						</li>
						<li>
							Auto state management
            <ul>
								<li>
									automatically enable/disable extensions base on auto state rules
                    <ul>
										<li>(you can save memory)</li>
										<li>(enable extensions only when you need them)</li>
									</ul>
								</li>
							</ul>
						</li>
						<li>
							Show history of&nbsp;extensions
            <ul>
								<li>installation, removal, enabling, disabling</li>
								<li>
									show the version change
                    <ul>
										<li>(you can tell when did extensions got updated)</li>
									</ul>
								</li>
							</ul>
						</li>
						<li>
							Show detailed information of&nbsp;extensions
            <ul>
								<li>download crx file</li>
								<li>open manifest file</li>
								<li>see permissions</li>
								<li>And a lot more informations</li>
							</ul>
						</li>
					</ul>
					<p>If you have questions about how to use NooBoss, you can find instructions here: <a href="https://ainoob.com/project/nooboss" target="_blank" onClick={this.cl.bind(null, 'about','link', 'https://ainoob.com/project/nooboss')}>NooBoss project</a></p>
				</section>
				<section>
					<h5>Acknowledgements</h5>
					<ul>
						<li>Special thanks to <a href="https://github.com/zhtw2013" target="_blank">zhtw2013</a> for providing zh-TW translation!</li>
						<li>NooBoss uses <a href="https://github.com/facebook/react" target="_blank">React(BSD Liscense)</a> from Facebook to build the bases</li>
						<li>NooBoss uses <a href="https://material.io/icons/" target="_blank">Material icons</a> from Google to make things look good</li>
						<li>NooBoss uses <a href="https://github.com/styled-components/styled-components" target="_blank">styled components(MIT Liscense)</a> from  <a href="https://twitter.com/glenmaddern" target="_blank">@glenmaddern</a>, <a href="https://twitter.com/mxstbr" target="_blank">@mxstbr</a> & <a href="https://twitter.com/_philpl" target="_blank">@_philpl‬</a> to manage CSS</li>
						<li>NooBoss uses <a href="https://github.com/hustcc/timeago-react" target="_blank">Timeago-React(MIT Liscense)</a> from Hust.cc to display timeago</li>
						<li>NooBoss uses <a href="https://github.com/casesandberg/react-color" target="_blank">React Color(MIT Liscense)</a> from case to pick color</li>
					</ul>
				</section>
			</AboutDiv>
		);
		switch (browser.i18n.getUILanguage()) {
			case 'zh':
			case 'zh-CN':
				aboutDiv = (
					<AboutDiv em={1.3}>
						<section>
							<h2>二管家</h2>
							<a id="icon1" target="_blank" href='https://ainoob.com/project/nooboss'
								onClick={this.cl.bind(null, 'about', 'clickAInoobLink', 'NooBoss')}>
								<img className="spinRight" src="/images/icon_128.png" />
							</a>
							<a id="icon2" target="_blank" href='https://ainoob.com/project/noobox'
								onClick={this.cl.bind(null, 'about', 'clickAInoobLink', 'NooBox')}>
								<img className="spinRight" src="/images/icon2_128.png" />
							</a>
							<p>啥？为啥？谁？</p>
							<p>简单的说，AInoob做了二管家，一个扩展管理扩展，为的是强化/协助/帮助那些需要的人，比如我。</p>
							<p>如果你想让二管家更好，请分享ta。</p>
							<p>分享->更多用户->AInoob花更多时间加强二管家。</p>
						</section>
						<section>
							<h5>一个关于二管家的列表</h5>
							<ol id="listOfNooBoss">
								<li>二管家是免费开源软件。
								<ol>
										<li>二管家使用<a target="_blank" href="https://www.gnu.org/licenses/gpl-3.0.en.html">GPL-V3协议</a></li>
										<li>不是你不用交钱，是你连1分钱都没法交。</li>
									</ol>
								</li>
								<li>我不会从二管家赚任何钱。
							</li>
								<li>我使用Google Analytics来看多少人在用二管家，满足我的虚荣心，这样我就可以继续写二管家了。
								<ol>
										<li>二管家会发送你的二管家的操作给AInoob。</li>
										<li>如果你想，你可以关闭加入社区的选项，但是我就会伤心了。请不要关闭，满足我的虚荣心。</li>
										<li>二管家不会发送你的任何隐私信息，你说我不用二管家赚钱，干嘛会去收集( ⊙o⊙?)。</li>
									</ol>
								</li>
								<li>我不接受任何捐款或软件使用费。
							</li>
								<li>如果有Bug，我一般都会很快修复。
								<ol>
										<li>如果我记得没错，所有致命bug都在一周内修复了。</li>
										<li>如果是新功能请求，那就有很多因素会决定到底什么时候发布了。</li>
									</ol>
								</li>
								<li>加入社区是使二管家更Diao的原因，请不要不加入啊～
								<ol>
										<li>你能看评分和关于你扩展的评价标签。</li>
										<li>你可以获得扩展推荐。</li>
										<li>AInoob可以知道有人在用二管家，他会高兴的。</li>
									</ol>
								</li>
							</ol>
						</section>
						<section>
							<h5>分析二管家</h5>
							<p>你喜欢二管家吗？如果喜欢，请考虑分享ta！</p>
							<a className="shareItem" target="_blank" href="http://www.jiathis.com/send/?webid=tsina&url=https://ainoob.com/project/nooboss&title=NooBoss"><img className="shareIcon" src="thirdParty/sina.png" /></a>
							<a className="shareItem" target="_blank" href="http://www.jiathis.com/send/?webid=weixin&url=https://ainoob.com/project/nooboss&title=NooBoss"><img className="shareIcon" src="thirdParty/wechat.png" /></a>
							<a className="shareItem" target="_blank" href="http://www.jiathis.com/send/?webid=renren&url=https://ainoob.com/project/nooboss&title=NooBoss"><img className="shareIcon" src="thirdParty/renren.png" /></a>
							<a className="shareItem" target="_blank" href="https://www.facebook.com/sharer/sharer.php?u=https%3A//ainoob.com/project/nooboss"><img className="shareIcon" src="thirdParty/facebook.png" /></a>
							<a className="shareItem" target="_blank" href="https://plus.google.com/share?url=https%3A//ainoob.com/project/nooboss"><img className="shareIcon" src="thirdParty/google.png" /></a>
							<a className="shareItem" target="_blank" href="https://www.linkedin.com/shareArticle?mini=true&url=https%3A//ainoob.com/project/nooboss&title=NooBoss%20---%20A%20ultimate%20extension%20for%20Chrome%20extensions%%20managing&summary=&source="><img className="shareIcon" src="thirdParty/linkedin.png" /></a>
							<a className="shareItem" target="_blank" href="https://twitter.com/home?status=https%3A//ainoob.com/project/nooboss"><img className="shareIcon" src="thirdParty/twitter.png" /></a>
						</section>
						<section>
							<h5>二管家能干什么？</h5>
							<p>目前，二管家可以 (应用/扩展/主题 在下面都会叫应用)</p>
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
										<li>根据当前网页看到二管家社区推荐的适用于当前网页的扩展</li>
										<li>每个人都可以给任何一个网站推荐好的扩展</li>
										<li>每个人都可以给任何一个扩展打标签</li>
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
							<p>如果你有各种关于二管家使用方面的问题，你可以在这里查看使用介绍: <a href="https://ainoob.com/project/nooboss" onClick={this.cl.bind(null, 'about', 'link', 'https://ainoob.com/project/nooboss')}>二管家项目</a></p>
						</section>
						<section>
							<h5>鸣谢</h5>
							<ul>
								<li>超级感谢<a href="https://github.com/zhtw2013" target="_blank">zhtw2013</a>提供的繁体翻译！</li>
								<li>二管家使用Facebook的<a href="https://github.com/facebook/react" target="_blank">React(BSD Liscense)</a>来弄的基础</li>
								<li>二管家使用Google的<a href="https://material.io/icons/" target="_blank">Material icons</a> from Google to make things look good</li>
								<li>二管家使用<a href="https://twitter.com/glenmaddern" target="_blank">@glenmaddern</a>, <a href="https://twitter.com/mxstbr" target="_blank">@mxstbr</a> & <a href="https://twitter.com/_philpl" target="_blank">@_philpl‬</a>的<a href="https://github.com/styled-components/styled-components" target="_blank">styled components(MIT Liscense)</a>来管理CSS</li>
								<li>二管家使用Hust.cc的<a href="https://github.com/hustcc/timeago-react" target="_blank">Timeago-React(MIT Liscense)</a>来展示过了多久</li>
								<li>二管家使用case的<a href="https://github.com/casesandberg/react-color" target="_blank">React Color(MIT Liscense)</a>来选择颜色</li>
							</ul>
						</section>
					</AboutDiv>
				);
			break;
			case 'zh-TW':
				aboutDiv = (
					<AboutDiv em={1.3}>
						<section>
							<h2>二管家</h2>
							<a id="icon1" target="_blank" href='https://ainoob.com/project/nooboss'
								onClick={this.cl.bind(null, 'about', 'clickAInoobLink', 'NooBoss')}>
								<img className="spinRight" src="/images/icon_128.png" />
							</a>
							<a id="icon2" target="_blank" href='https://ainoob.com/project/noobox'
								onClick={this.cl.bind(null, 'about', 'clickAInoobLink', 'NooBox')}>
								<img className="spinRight" src="/images/icon2_128.png" />
							</a>
							<p>啥？為啥？誰？</p>
							<p>簡單的說，AInoob做了二管家，一個管理擴充功能用的擴充功能，為的是強化/協助/幫助那些需要的人，比如我。</p>
							<p>如果你想讓二管家更好，請分享它給朋友。</p>
							<p>分享->更多使用者->AInoob花更多時間加強二管家。</p>
						</section>
						<section>
							<h5>一個關於二管家的清單</h5>
							<ol id="listOfNooBoss">
								<li>二管家是免費開源軟體。
								<ol>
										<li>二管家使用<a target="_blank" href="https://www.gnu.org/licenses/gpl-3.0.en.html">GPL-V3協議</a></li>
										<li>不是你不用交錢，是你連1分錢都沒法交。</li>
									</ol>
								</li>
								<li>我不會從二管家賺任何錢。
							</li>
								<li>我使用Google Analytics來看多少人在用二管家，滿足我的虛榮心，這樣我就可以繼續寫二管家了。
								<ol>
										<li>二管家會傳送你的二管家的操作給AInoob。</li>
										<li>如果你想，你可以關閉加入社群的選項，但是我就會傷心了。請不要關閉，滿足我的虛榮心。</li>
										<li>二管家不會傳送你的任何隱私資訊，你說我不用二管家賺錢，干嘛要去收集( ⊙o⊙?)。</li>
									</ol>
								</li>
								<li>我不接受任何捐款或軟體使用費。
							</li>
								<li>如果有Bug，我一般都會很快修復。
								<ol>
										<li>如果我記得沒錯，所有致命bug都在一週內修復了。</li>
										<li>如果是新功能要求，那就有很多因素會決定到底什麼時候發佈了。</li>
									</ol>
								</li>
								<li>加入社群是使二管家更屌的原因，請不要不加入啊～
								<ol>
										<li>你能看評分和關於你擴充功能的評價標籤。</li>
										<li>你可以獲得擴充功能推薦。</li>
										<li>AInoob可以知道有人在用二管家，他會高興的。</li>
									</ol>
								</li>
							</ol>
						</section>
						<section>
							<h5>分析二管家</h5>
							<p>你喜歡二管家嗎？如果喜歡，請考慮將它分享出去！</p>
							<a className="shareItem" target="_blank" href="http://www.jiathis.com/send/?webid=tsina&url=https://ainoob.com/project/nooboss&title=NooBoss"><img className="shareIcon" src="thirdParty/sina.png" /></a>
							<a className="shareItem" target="_blank" href="http://www.jiathis.com/send/?webid=weixin&url=https://ainoob.com/project/nooboss&title=NooBoss"><img className="shareIcon" src="thirdParty/wechat.png" /></a>
							<a className="shareItem" target="_blank" href="http://www.jiathis.com/send/?webid=renren&url=https://ainoob.com/project/nooboss&title=NooBoss"><img className="shareIcon" src="thirdParty/renren.png" /></a>
							<a className="shareItem" target="_blank" href="https://www.facebook.com/sharer/sharer.php?u=https%3A//ainoob.com/project/nooboss"><img className="shareIcon" src="thirdParty/facebook.png" /></a>
							<a className="shareItem" target="_blank" href="https://plus.google.com/share?url=https%3A//ainoob.com/project/nooboss"><img className="shareIcon" src="thirdParty/google.png" /></a>
							<a className="shareItem" target="_blank" href="https://www.linkedin.com/shareArticle?mini=true&url=https%3A//ainoob.com/project/nooboss&title=NooBoss%20---%20A%20ultimate%20extension%20for%20Chrome%20extensions%%20managing&summary=&source="><img className="shareIcon" src="thirdParty/linkedin.png" /></a>
							<a className="shareItem" target="_blank" href="https://twitter.com/home?status=https%3A//ainoob.com/project/nooboss"><img className="shareIcon" src="thirdParty/twitter.png" /></a>
						</section>
						<section>
							<h5>二管家能幹什麼？</h5>
							<p>目前，二管家可以管理 (應用/擴充功能/主題 在下面都會叫應用)</p>
							<ul>
								<li>
									管理你的應用
															<ul>
										<li>開啟/關閉/刪除一個或多個應用</li>
									</ul>
								</li>
								<li>
									社群分享
															<ul>
										<li>根據目前網頁看到二管家社群推薦的適用於目前網頁的擴充功能</li>
										<li>每個人都可以給任何一個網站推薦好的擴充功能</li>
										<li>每個人都可以給任何一個擴充功能打標籤</li>
									</ul>
								</li>
								<li>
									自動應用狀態管理
															<ul>
										<li>
											根據設定的規則自動啟用或停用應用
																				<ul>
												<li>(減少記憶體占用)</li>
												<li>(只有在需要的時候才開啟應用)</li>
											</ul>
										</li>
									</ul>
								</li>
								<li>
									應用歷程記錄
															<ul>
										<li>記錄應用的安裝，移除，開啟，和關閉</li>
										<li>
											可以知道版本變化
																			</li>
									</ul>
								</li>
								<li>
									顯示應用詳細資訊
															<ul>
										<li>下載crx檔案</li>
										<li>開啟manifest檔案</li>
										<li>檢視權限</li>
										<li>和各種各樣的詳細資訊</li>
									</ul>
								</li>
							</ul>
							<p>如果你有各種關於二管家使用方面的問題，你可以在這裡檢視使用介紹: <a href="https://ainoob.com/project/nooboss" onClick={this.cl.bind(null, 'about', 'link', 'https://ainoob.com/project/nooboss')}>二管家項目</a></p>
						</section>
						<section>
							<h5>鳴謝</h5>
							<ul>
								<li>超級感謝<a href="https://github.com/zhtw2013" target="_blank">zhtw2013</a>提供的繁體翻譯！</li>
								<li>二管家使用Facebook的<a href="https://github.com/facebook/react" target="_blank">React(BSD Liscense)</a>來弄的基礎</li>
								<li>二管家使用Google的<a href="https://material.io/icons/" target="_blank">Material icons</a> from Google to make things look good</li>
								<li>二管家使用<a href="https://twitter.com/glenmaddern" target="_blank">@glenmaddern</a>, <a href="https://twitter.com/mxstbr" target="_blank">@mxstbr</a> & <a href="https://twitter.com/_philpl" target="_blank">@_philpl‬</a>的<a href="https://github.com/styled-components/styled-components" target="_blank">styled components(MIT Liscense)</a>來管理CSS</li>
								<li>二管家使用Hust.cc的<a href="https://github.com/hustcc/timeago-react" target="_blank">Timeago-React(MIT Liscense)</a>來展示過了多久</li>
								<li>二管家使用case的<a href="https://github.com/casesandberg/react-color" target="_blank">React Color(MIT Liscense)</a>來選擇色彩</li>
							</ul>
						</section>
					</AboutDiv>
				);
				break;
		}
		return (aboutDiv);
	}
}

export default About;
