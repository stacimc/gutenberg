<?php
/**
 * Plugin Name: Gutenberg Test Marquee Widget
 * Plugin URI: https://github.com/WordPress/gutenberg
 * Author: Gutenberg Team
 *
 * @package gutenberg-test-marquee-widget
 */

/**
 * Add a non-WP_Widget marquee widget.
 */
function marquee_greeting_init() {
	wp_register_sidebar_widget(
		'marquee_greeting',
		'Marquee Greeting',
		function() {
			$greeting = get_option( 'marquee_greeting', 'Hello!' );
			printf( '<marquee>%s</marquee>', esc_html( $greeting ) );
		}
	);

	wp_register_widget_control(
		'marquee_greeting',
		'Marquee Greeting',
		function() {
			if ( isset( $_POST['marquee-greeting'] ) ) {
				update_option(
					'marquee_greeting',
					sanitize_text_field( $_POST['marquee-greeting'] )
				);
			}

			$greeting = get_option( 'marquee_greeting' );
			?>
			<p>
				<label for="marquee-greeting">Greeting:</label>
				<input
					id="marquee-greeting"
					class="widefat"
					name="marquee-greeting"
					type="text"
					value="<?php echo esc_attr( $greeting ); ?>"
					placeholder="Hello!"
				/>
			</p>
			<?php
		}
	);
}
add_action( 'init', 'marquee_greeting_init' );
