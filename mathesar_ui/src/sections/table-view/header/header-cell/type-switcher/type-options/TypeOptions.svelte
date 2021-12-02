<script lang="ts">
  import { faDatabase } from '@fortawesome/free-solid-svg-icons';
  import {
    Button, Icon,
  } from '@mathesar-component-library';

  import type { AbstractType } from '@mathesar/stores/abstract-types/types.d';

  import DefaultValue from './DefaultValue.svelte';

  export let selectedAbstractType: AbstractType;
  export let abstractTypeOfColumn: AbstractType;

  let selectedTab = 'database';

  $: formOptions = selectedTab === 'database'
    ? selectedAbstractType.typeSwitchOptions?.database?.fields
    : selectedAbstractType.typeSwitchOptions?.display?.fields;
</script>

<div class="type-options">
  <!-- TODO: Make tab container more generic to be used here -->
  <ul class="type-option-tabs">
    <li>
      <Button appearance="ghost" class="padding-zero type-option-tab"
        on:click={() => selectedTab = 'database'}>
        <Icon size="0.75em" data={faDatabase}/>
        <span>Database</span>
      </Button>
    </li>
    {#if selectedAbstractType.typeSwitchOptions?.display}
      <li>
        <Button appearance="ghost" class="padding-zero type-option-tab"
          on:click={() => selectedTab = 'display'}>
          <Icon size="0.75em" data={faDatabase}/>
          <span>Display</span>
        </Button>
      </li>
    {/if}
  </ul>

  <div class="type-options-content">
    {#if selectedAbstractType}
      <!-- <FormConstructor {...form}/> -->
    {/if}

    {#if selectedTab === 'database'}
      <!-- <DefaultValue/> -->
    {/if}
  </div>
</div>
