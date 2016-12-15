var React = require('react');
var Helmet = require('react-helmet');
module.exports = React.createClass({
  getInitialState: function(){
    return null;
  },
  componentDidMount: function(){
  },
  render: function(){
    return(
      <div id="About">
        <Helmet
          title="About"
        />
        <h1>About</h1>
        <a target="_blank" href="https://ainoob.com/project/nooboss"><img id="icon1" className="spinRight" src="/images/icon_128.png" /></a>
        <a target="_blank" href="https://ainoob.com/project/noobox"><img id="icon2" className="spinLeft" src="/images/icon_2.png" /></a>
        <section>
          <h2>What can NooBoss do?</h2>
          <p>Right now, NooBoss can (apps/extensions/theme will be called apps down below)</p>
          <ul><li>Manage your apps<ul><li>enable/disable/remove one or a bunch of apps</li></ul></li><li>Auto state management<ul><li>automatically enable/disable apps base on auto state rules<ul><li>(you can save memory)</li><li>(enable apps only when you need them)</li></ul></li></ul></li><li>Show history of&nbsp;apps<ul><li>installation, removal, enabling, disabling</li><li>show the version change<ul><li>(you can tell when did apps got updated)</li></ul></li></ul></li><li>Show detailed information of&nbsp;apps<ul><li>download crx file</li><li>open manifest file</li><li>see permissions</li><li>And a lot more informations</li></ul></li></ul>
          <p>If you have questions about how to use NooBoss, you can find instructions here: <a target="_blank" href="https://ainoob.com/project/nooboss">NooBoss project</a></p>
        </section>
        <section>
          <h2>Who made NooBoss</h2>
          <p>NooBoss is an open sourced project under GPL-V3 made by <a target="_blank" href="https://ainoob.com">AInoob</a>, you can check the project progress <a target="_blank" href="https://ainoob.com/project/nooboss">here</a></p>
        </section>
        <section>
          <h2>Privacy</h2>
          <p>NooBoss is a software with proud, it will never steal your private information, and it will never show ADs without asking you.</p>
          <p>By default, NooBoss will share you usage of NooBoss and Apps you installed on Chrome to NooBoss community, please leave this on if you want to support NooBoss or you want AInoob to keep developing NooBoss. Your personal information will not be shared.</p>
        </section>
        <section>
          <h2>How to support NooBoss?</h2>
          <p>If you love NooBoss, you can choose to show ADs(it's off by default), so I will be more motivated to maintain and upgrade NooBoss. If you turn this on, NooBoss will show ADs only when you open NooBoss, and will only show ADs within NooBoss. Feel free to turn it on or off, as long as you turned on the joinCommunity, AInoob will know that sommeone else, not just him, is using NooBoss, and that feels good man/woman.</p>
        </section>
        <section>
          <h2>Any suggestions?</h2>
          <p>If you have any suggestions about how to make NooBoss better, plese comment on support page in Chrome web store.</p>
        </section>
      </div>
    );
  }
});
