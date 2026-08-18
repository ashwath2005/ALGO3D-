import gsap from 'gsap';

/**
 * Centralized Animation Controller
 * Handles GSAP lifecycle, active tween tracking, version tokens to prevent race conditions during rapid scrubbing, and clean cancellations.
 */
class AnimationController {
  constructor() {
    this.version = 0;
    this.activeTweens = new Set();
  }

  /**
   * Increments animation version token and cancels all currently running tweens.
   */
  invalidate() {
    this.version++;
    this.cancelAll();
    return this.version;
  }

  /**
   * Get current version token
   */
  getVersion() {
    return this.version;
  }

  /**
   * Track a GSAP tween/timeline
   */
  track(tween) {
    if (!tween) return tween;
    this.activeTweens.add(tween);

    const onComplete = tween.eventCallback('onComplete');
    tween.eventCallback('onComplete', (...args) => {
      this.activeTweens.delete(tween);
      if (typeof onComplete === 'function') onComplete(...args);
    });

    return tween;
  }

  /**
   * Cancel all registered GSAP animations
   */
  cancelAll() {
    for (const tween of this.activeTweens) {
      try {
        tween.kill();
      } catch (e) {
        // Ignore dead tweens
      }
    }
    this.activeTweens.clear();
  }

  /**
   * Animate physical position movement
   */
  animateMove({ target, to, duration = 0.4, easing = 'power2.out', version = null, onComplete }) {
    if (version !== null && version !== this.version) return null;
    if (!target) return null;

    const tween = gsap.to(target, {
      x: to.x !== undefined ? to.x : target.x,
      y: to.y !== undefined ? to.y : target.y,
      z: to.z !== undefined ? to.z : target.z,
      duration,
      ease: easing,
      onComplete: () => {
        if (version !== null && version !== this.version) return;
        if (typeof onComplete === 'function') onComplete();
      }
    });

    return this.track(tween);
  }

  /**
   * Animate swap between two 3D positions with subtle arc
   */
  animateSwap({ objectA, objectB, posA, posB, duration = 0.45, easing = 'power2.inOut', version = null, onComplete }) {
    if (version !== null && version !== this.version) return null;

    const tl = gsap.timeline({
      onComplete: () => {
        if (version !== null && version !== this.version) return;
        if (typeof onComplete === 'function') onComplete();
      }
    });

    if (objectA && posB) {
      tl.to(objectA.position, {
        x: posB.x,
        y: posB.y !== undefined ? posB.y : objectA.position.y,
        z: posB.z !== undefined ? posB.z : objectA.position.z,
        duration,
        ease: easing
      }, 0);
    }

    if (objectB && posA) {
      tl.to(objectB.position, {
        x: posA.x,
        y: posA.y !== undefined ? posA.y : objectB.position.y,
        z: posA.z !== undefined ? posA.z : objectB.position.z,
        duration,
        ease: easing
      }, 0);
    }

    return this.track(tl);
  }

  /**
   * Animate pulse / scale punch
   */
  animatePulse({ target, scale = 1.15, duration = 0.3, version = null }) {
    if (version !== null && version !== this.version) return null;
    if (!target) return null;

    const initialScale = { x: target.scale.x, y: target.scale.y, z: target.scale.z };
    const tl = gsap.timeline();

    tl.to(target.scale, {
      x: initialScale.x * scale,
      y: initialScale.y * scale,
      z: initialScale.z * scale,
      duration: duration / 2,
      ease: 'power2.out'
    });

    tl.to(target.scale, {
      x: initialScale.x,
      y: initialScale.y,
      z: initialScale.z,
      duration: duration / 2,
      ease: 'power2.in'
    });

    return this.track(tl);
  }

  /**
   * Animate complete celebration flash
   */
  animateComplete({ targets, duration = 0.6, version = null }) {
    if (version !== null && version !== this.version) return null;
    if (!Array.isArray(targets) || targets.length === 0) return null;

    const tl = gsap.timeline();
    targets.forEach((target, i) => {
      if (!target) return;
      tl.to(target.position, {
        y: '+=0.4',
        duration: 0.2,
        yoyo: true,
        repeat: 1,
        ease: 'power1.inOut'
      }, i * 0.04);
    });

    return this.track(tl);
  }
}

export const animationController = new AnimationController();
