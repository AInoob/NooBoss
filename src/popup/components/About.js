import React, { Component } from 'react';
import styled from 'styled-components';
import { isZh } from '../../utils';

const AboutDiv = styled.div`
`;

class About extends Component{
	constructor(props) {
		super(props);
		this.state = {
			isZh: false
		};
	}
	async componentDidMount() {
		this.setState({ isZh: await isZh() });
	}
	render() {
		console.log(this.state.isZh);
		let aboutDiv = (
			<AboutDiv>
				<section>
					<p>In short, I made NooBoss only to empower/faciliate/help those who needs it, like myself.
					Share NooBoss if you like it or if you want it to be better.
					Share -> More users -> AInoob dedicate more time on improving NooBoss.</p>
				</section>

				<section>
					1. NooBoss is open source software and charge free.
					2. I do not make any money by making NooBoss
					3. I use Google Analytics to see how many people are using NooBoss, thus giving me a good motive to work on NooBoss.
						a. NooBoss sends your usage of NooBoss.
						b. NooBoss do not send any of your personal information to AInoob, why would I need them if I am not making money, right?
					4. I do not accept any donation or service fee.
					5. If there is a bug, I usually fixed it relatively fast.
						a. As far as I can tell, all lethal bugs were fixed within a week.
					6. Join community is what make NooBoss even more special, please do not leave
				</section>
			</AboutDiv>
		);
		if (this.state.isZh) {
			aboutDiv = (
				<AboutDiv>
					<section>
						<p>In short, I made NooBoss only to empower/faciliate/help those who needs it, like myself.
						Share NooBoss if you like it or if you want it to be better.
						Share -> More users -> AInoob dedicate more time on improving NooBoss.</p>
					</section>

					<section>
						1. NooBoss is open source software and charge free.
						2. I do not make any money by making NooBoss
						3. I use Google Analytics to see how many people are using NooBoss, thus giving me a good motive to work on NooBoss.
							a. NooBoss sends your usage of NooBoss.
							b. NooBoss do not send any of your personal information to AInoob, why would I need them if I am not making money, right?
						4. I do not accept any donation or service fee.
						5. If there is a bug, I usually fixed it relatively fast.
							a. As far as I can tell, all lethal bugs were fixed within a week.
						6. Join community is what make NooBoss even more special, please do not leave
					</section>
				</AboutDiv>
			);
		}
		return (aboutDiv);
	}
}

export default About;
