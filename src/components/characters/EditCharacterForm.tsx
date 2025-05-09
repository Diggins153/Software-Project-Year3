"use client";

import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { updateCharacter } from "@/lib/actions/characters";
import { EditCharacterFormSchema } from "@/lib/formSchemas";
import { Character } from "@/types/Character";
import { Class } from "@/types/Class";
import { Race } from "@/types/Race";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

interface EditCharacterFormProps {
    character: Character;
    races: Race[];
    classes: Class[];

    onSubmit?(): void;
}

export default function EditCharacterForm({ character, races, onSubmit, classes }: EditCharacterFormProps) {
    const mbInB = 1_048_576;
    const router = useRouter();
    const form = useForm<z.infer<typeof EditCharacterFormSchema>>({
        resolver: zodResolver(EditCharacterFormSchema),
        defaultValues: {
            id: character.id,
            name: character.name,
            handle: character.handle,
            image: character.image,
            raceId: character.race_id,
            classId: character.class_id,
            level: character.level,
        },
        progressive: true,
    });
    const [ imageUrl, setImageUrl ] = useState<string>();

    const imageRef = form.register("image");

    async function handleUpdateCharacter(data: z.infer<typeof EditCharacterFormSchema>) {
        const response = await updateCharacter(character.id, data);

        if (response.ok) {
            router.refresh();
            if (!!onSubmit) onSubmit();
        } else {
            toast.error(response.message);
        }
    }

    useEffect(() => {
        // Is this an edit form?
        if (!!form.formState.defaultValues?.image) {
            setImageUrl(form.formState.defaultValues.image);
        }
        // No Image
        else {
            setImageUrl(undefined);
        }

        return () => {
            if (imageUrl && imageUrl?.startsWith("blob:"))
                URL.revokeObjectURL(imageUrl);
        };
    }, [ form.formState.defaultValues?.image ]);

    return <Form { ...form }>
        <form onSubmit={ form.handleSubmit(handleUpdateCharacter) } className="space-y-8">
            <FormField
                control={ form.control }
                name="image"
                render={ () =>
                    <FormItem>
                        <FormLabel>Image</FormLabel>
                        <div className="flex flex-col bg-background rounded-md px-2 border">
                            <div className="flex items-center">
                                <FormControl>
                                    <Input
                                        type="file"
                                        accept="image/png,image/jpeg" { ...imageRef }
                                        className="border-none file:border file:border-solid file:active:border-accent file:rounded-md file:px-4 px-0"
                                        onChange={ e => {
                                            const file = e.target.files?.[0];
                                            setImageUrl(file ? URL.createObjectURL(file) : undefined);
                                            form.clearErrors("image");
                                            if ((e.target.files?.[0]?.size ?? (mbInB + 1)) > mbInB) {
                                                form.setError("image", { message: "Maximum file size allowed is 1MB" });
                                            }
                                        } }
                                    />
                                </FormControl>
                            </div>
                            { imageUrl &&
                                <Image
                                    src={ imageUrl }
                                    alt="File Input Preview"
                                    width={ 75 }
                                    height={ 75 }
                                    className="character-image mx-auto mb-2 mt-1"
                                />
                            }
                        </div>
                        <FormMessage/>
                    </FormItem>
                }
            />

            <FormField
                control={ form.control }
                name="name"
                render={ ({ field }) =>
                    <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                            <Input { ...field }/>
                        </FormControl>
                        <FormMessage/>
                    </FormItem>
                }
            />

            <FormField
                control={ form.control }
                name="handle"
                render={ ({ field }) =>
                    <FormItem>
                        <FormLabel>Handle</FormLabel>
                        <FormControl>
                            <Input { ...field }/>
                        </FormControl>
                        <FormDescription>
                            Your handle will be
                            @{ form.getValues("handle").toLowerCase().replaceAll(/(?![a-z0-9-]+)./g, "") }
                        </FormDescription>
                        <FormMessage/>
                    </FormItem>
                }
            />

            <FormField
                control={ form.control }
                name="raceId"
                render={ ({ field }) =>
                    <FormItem>
                        <FormLabel>Race</FormLabel>
                        <Select onValueChange={ field.onChange } defaultValue={ field.value.toString() }>
                            <FormControl>
                                <SelectTrigger>
                                    <SelectValue placeholder="Race"/>
                                </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                { races.map(race =>
                                    <SelectItem
                                        key={ race.id }
                                        value={ race.id.toString() }
                                    >
                                        { race.name }
                                    </SelectItem>) }
                            </SelectContent>
                        </Select>
                        <FormMessage/>
                    </FormItem>
                }
            />

            <FormField
                control={ form.control }
                name="classId"
                render={ ({ field }) =>
                    <FormItem>
                        <FormLabel>Class</FormLabel>
                        <Select onValueChange={ field.onChange } defaultValue={ field.value.toString() }>
                            <FormControl>
                                <SelectTrigger>
                                    <SelectValue placeholder="Class"/>
                                </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                { classes.map(cClass =>
                                    <SelectItem
                                        key={ cClass.id }
                                        value={ cClass.id.toString() }
                                    >
                                        { cClass.name }
                                    </SelectItem>) }
                            </SelectContent>
                        </Select>
                        <FormMessage/>
                    </FormItem>
                }
            />

            <FormField
                control={ form.control }
                name="level"
                render={ ({ field }) =>
                    <FormItem>
                        <FormLabel>Level</FormLabel>
                        <FormControl>
                            <Input type="number" min="1" max="20" { ...field }/>
                        </FormControl>
                        <FormMessage/>
                    </FormItem>
                }
            />

            <div className="flex justify-end">
                <Button type="submit" disabled={ !form.formState.isValid }>Save Changes</Button>
            </div>
        </form>
    </Form>;
}