/**
 * Keyed tracks.
 *
 * Key a value (V, the dependent variable) to time (T, the independent
 * variable, it doesn't actually have to be time)
 *
 * Use `ScalarTrack` to animate a scalar V.
 * Use `VectorTrack` to animate a V that is a vector of 2 or more dimensions.
 *
 * In and out rates can be set per key, which will use Hermite interpolation.
 * Specify rates in delta-V units per a delta-T of 1.
 *
 * Here's how you can use it
 * To set up:
 * ```
 * let myAnimation = new ScalarTrack()
 *   .addKey() // addKey and getKey return Key objects
 *     .setTV(0, 90) // methods on Key objects are chainable
 *     .setInOutHermite(0, 0)
 *     .endKey() // when you're done, call endKey to return to the ScalarTrack chain
 *   .addKey() // repeat as necessary
 *     .setTV(1000, 20)
 *     .endKey() // remember to call endKey on the last key as well to assign
 *               // your new ScalarTrack to your variable.  otherwise you'll
 *               // assign a key object
 * ```
 *
 * In your animation loop:
 * ```
 * let now = Date.now(); // assuming your T axis is time in milliseconds
 * let currentValue = myAnimation.evaluate(now);
 * ```
 *
 * `VectorTrack`s are composed of one `ScalarTrack` per dimension. You can add/set
 * keys on the constituent `ScalarTrack`, or add/set them on the parent
 * `VectorTrack` and provide dimensioned values as arrays.
 *
 * An example of setting all dimensions at once:
 * ```
 * let myAnimation = new VectorTrack(3)
 *   .addKey()
 *     .setTV(0, [ 0.25, 0.5, 1 ]) // at 0, set X Y and Z (or maybe RGB?) to 0.25, 0.5 and 1
 *     .setInOutHermite([ 0, 0, 0 ], [ 0, 0, 0 ]) // in and out velocities are dimensioned as well
 *     .endKey()
 *   .addKey()
 *     ...
 *     .endKey()
 * ```
 *
 * An example of setting dimensions one at a time:
 * ```
 * let myAnimation = new VectorTrack(2)
 *   .getTrack(0) // edit the X track
 *     .addKey()
 *       .setTV(0, 0)
 *       .setOutHermite(0)
 *       .endKey()
 *     .addKey()
 *       .setTV(1000, 1)
 *       .setInHermite(0)
 *       .endKey() // endKey takes you back to the ScalarTrack
 *     .endTrack() // endTrack takes you back to the VectorTrack
 *   .getTrack(1) // edit the Y track
 *     .addKey()
 *       .setTV(0, 1)
 *       .setOutHermite(0)
 *       .endKey()
 *     .addKey()
 *       .setTV(1000, 0)
 *       .setInHermite(0)
 *       .endKey()
 *     .endTrack()
 * ```
 */

export {
  TRACK_EXTRAPOLATE_CLAMP,
  TRACK_EXTRAPOLATE_CONTINUE,
} from './lib/tracks/consts';

export { ScalarTrack } from './lib/tracks/scalar';
export { VectorTrack } from './lib/tracks/vector';
