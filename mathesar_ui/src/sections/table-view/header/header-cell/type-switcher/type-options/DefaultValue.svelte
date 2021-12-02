<script lang="ts">
  import {
    Checkbox, TextInput,
  } from '@mathesar-component-library';
  import type { DbType } from '@mathesar/App.d';
  import type {
    Column,
  } from '@mathesar/stores/table-data/types';

  export let dbType: DbType;
  export let defaultValue: Column['default'];

  let textInputValue = '';
  let hasDefaultValue = defaultValue !== null;

  function onDefaultValueChange(_defaultValue: Column['default']) {
    textInputValue = _defaultValue?.toString() || '';
  }

  function onTextInputValueChange(_textInputValue: string) {
    // TODO: Validate, parse and set default value
  }

  $: onDefaultValueChange(defaultValue);
  $: onTextInputValueChange(textInputValue);
</script>

<div>
  <Checkbox bind:checked={hasDefaultValue} appearance="toggle" id="set-default-value"/>
  <label for="set-default-value">Set Default Value</label>
</div>

{#if hasDefaultValue}
  <TextInput bind:value={textInputValue}/>
{/if}
