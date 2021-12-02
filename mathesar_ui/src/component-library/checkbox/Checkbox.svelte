<script context="module" lang="ts">
  let moduleWideId = 0;

  function getId() {
    moduleWideId += 1;
    return `checkbox-${moduleWideId}`;
  }
</script>

<script lang="ts">
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();

  export let checked = false;
  export let value = null;
  export let indeterminate = false;
  export let disabled = false;
  export let label: string = null;
  export let appearance: 'default' | 'toggle' = 'default';
  export let id: string = undefined;

  $: componentId = id || getId();

  function onChange(e: Event) {
    checked = !checked;
    dispatch('change', {
      checked,
      originalEvent: e,
    });
  }
</script>

<label class="checkbox {appearance}" for={componentId}
        class:checked class:indeterminate class:disabled>
  <span class="wrapper">
    <input type="checkbox" id={componentId}
            checked={checked}
            {indeterminate} {disabled} {value}
            on:change={onChange}/>
    <span class="alias"></span>
  </span>

  {#if label}
    <span class="label">{label}</span>
  {/if}
</label>

<style global lang="scss">
  @import "Checkbox.scss";
</style>
