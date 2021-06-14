import BannerEvent from '../bannerEvent';

const TopBanner = () => {

return (
{this.props.cEvent.styles &&
	this.props.cEvent.styles.show_banner &&
	(this.props.cEvent.styles.show_banner === 'true' ||
	  this.props.cEvent.styles.show_banner === true) &&
	this.props.currentActivity === null ? (
	  <BannerEvent
		bgImage={
		  this.props.cEvent.styles && this.props.cEvent.styles.banner_image
			? this.props.cEvent.styles.banner_image
			: this.props.cEvent.picture
			? this.props.cEvent.picture
			: 'https://bulma.io/images/placeholders/1280x960.png'
		}
		mobileBanner={
		  this.props.cEvent.styles &&
		  this.props.cEvent.styles.mobile_banner &&
		  this.props.cEvent.styles.mobile_banner
		}
		bgImageText={
		  this.props.cEvent.styles && this.props.cEvent.styles.event_image
			? this.props.cEvent.styles.event_image
			: ''
		}
		title={this.props.cEvent.name}
		eventId={this.props.cEvent._id}
		styles={this.props.cEvent.styles}
		organizado={
		  <Link
			to={`/page/${this.props.cEvent.organizer_id}?type=${this.props.cEvent.organizer_type}`}>
			{this.props.cEvent.organizer.name
			  ? this.props.cEvent.organizer.name
			  : this.props.cEvent.organizer.email}
		  </Link>
		}
		place={
		  <span>
			{this.props.cEvent.venue} {this.props.cEvent.location.FormattedAddress}
		  </span>
		}
		dateStart={this.props.cEvent.date_start}
		dateEnd={this.props.cEvent.date_end}
		dates={this.props.cEvent.dates}
		type_event={this.props.cEvent.type_event}
	  />
	) : (
	  <div>
		{this.props.cEvent.styles &&
		  this.props.cEvent.styles.show_banner === undefined &&
		  this.state.headerVisible &&
		  this.props.currentActivity === null && (
			<BannerEvent
			  bgImage={
				this.props.cEvent.styles && this.props.cEvent.styles.banner_image
				  ? this.props.cEvent.styles.banner_image
				  : this.props.cEvent.picture
				  ? this.props.cEvent.picture
				  : 'https://bulma.io/images/placeholders/1280x960.png'
			  }
			  bgImageText={
				this.props.cEvent.styles && this.props.cEvent.styles.event_image
				  ? this.props.cEvent.styles.event_image
				  : ''
			  }
			  title={this.props.cEvent.name}
			  organizado={
				<Link
				  to={`/page/${this.props.cEvent.organizer_id}?type=${this.props.cEvent.organizer_type}`}>
				  {this.props.cEvent.organizer.name
					? this.props.cEvent.organizer.name
					: this.props.cEvent.organizer.email}
				</Link>
			  }
			  place={
				<span>
				  {this.props.cEvent.venue} {this.props.cEvent.location.FormattedAddress}
				</span>
			  }
			  dateStart={this.props.cEvent.date_start}
			  dateEnd={this.props.cEvent.date_end}
			  dates={this.props.cEvent.dates}
			  type_event={this.props.cEvent.type_event}
			/>
		  )}
	  </div>
	)}

)}

export default TopBanner;