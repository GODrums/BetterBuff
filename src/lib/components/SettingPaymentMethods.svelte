<script lang="ts">
import { onMount } from 'svelte';
import * as Dialog from '$lib/components/ui/dialog';
import * as Tooltip from '$lib/components/ui/tooltip';
import { cn } from '$lib/utils';
import balance from '../icons/payment-balance.png';
import bank from '../icons/payment-bank.png';
import card from '../icons/payment-card.png';
import wechat from '../icons/payment-wechat.png';
import { ExtensionStorage, type IStorage } from '../util/storage';
import { MaterialSymbolsHelpRounded } from './icons';
import MaterialSymbolsPayments from './icons/MaterialSymbolsPayments.svelte';
import Button from './ui/button/button.svelte';
import Label from './ui/label/label.svelte';

let text = 'Preferred Payment Methods';

let choices: { [K in keyof IStorage['preferredPayments']]: { text: string; icon: string } } = {
	balance: { text: 'BUFF balance-Alipay', icon: balance },
	bank: { text: 'BUFF Balance-Bank Card', icon: bank },
	card: { text: 'Alipay - Credit card', icon: card },
	wechat: { text: 'WeChat Pay', icon: wechat },
	'wechat-split': { text: 'WeChat Split', icon: wechat },
};

let storage = ExtensionStorage.preferredPayments;
let values: Partial<IStorage['preferredPayments']> = {};

onMount(async () => {
	values = await storage.getValue();
});

const storeValue = async (choice: keyof IStorage['preferredPayments']) => {
	values[choice] = !values[choice];

	await storage.setValue(values as IStorage['preferredPayments']);
};

const notypecheck = (x: string) => x as keyof IStorage['preferredPayments'];
</script>

<div class="w-full flex flex-col border border-base-300 bg-card/90 rounded-lg py-2 px-3 z-10">
    <div class="flex items-center gap-2 mt-1 mx-1">
		<MaterialSymbolsPayments class="size-6 text-neutral-500" />
        <Label class="text-sm font-medium">{text}</Label>
        <Dialog.Root>
            <Dialog.Trigger class="flex items-center">
                <Button variant="ghost" class="size-4 p-0 m-0" title="Click for a detailed explanation">
                    <MaterialSymbolsHelpRounded class="size-5 text-neutral-300 hover:text-neutral-100" />
                </Button>
            </Dialog.Trigger>
            <Dialog.Content>
                <Dialog.Header>
                    <Dialog.Title>Preferred Payment Methods</Dialog.Title>
                    <Dialog.Description class="text-gray-300">
                        <p>Listings that do not support at least one of your selected payment methods will be grayed out.</p>
                        <p>HINT: If you are using Buff as a foreigner, likely you can only use 'BUFF balance-Alipay'.</p>
                    </Dialog.Description>
                </Dialog.Header>
            </Dialog.Content>
        </Dialog.Root>
    </div>
    <div class="flex items-center justify-center mx-2 gap-4 mt-2">
        {#each Object.entries(choices) as [choice, attr]}
            <Tooltip.Root>
                <Tooltip.Trigger>
                    <Button variant="ghost" size="icon" class={cn(values[notypecheck(choice)] && 'bg-[#00b3f0]/50 hover:bg-[#00b3f0]/70')} on:click={() => storeValue(notypecheck(choice))}>
                        <img src={attr.icon} alt={attr.text} class="w-6 h-6" />
                    </Button>
                </Tooltip.Trigger>
                <Tooltip.Content>
                    <p>{attr.text}</p>
                </Tooltip.Content>
            </Tooltip.Root>
        {/each}
    </div>
    <dialog id="dialog_preferred_payments" class="modal">
        <div class="modal-box">
            <h3 class="font-bold text-lg">Hello!</h3>
            <p class="py-4">
                Select your available payment methods. Listings that do not support at least one of your selected payment methods will be grayed out. HINT: If you are using Buff as a foreigner, likely
                you can only use 'BUFF balance-Alipay'.
            </p>
            <div class="modal-action">
                <form method="dialog">
                    <!-- if there is a button in form, it will close the modal -->
                    <button class="btn">Close</button>
                </form>
            </div>
        </div>
    </dialog>
</div>
